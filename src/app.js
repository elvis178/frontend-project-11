import i18next from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import { uniqueId } from 'lodash';
import handleStateChange from './view.js';
import resources from './locales';
import parseRss from './parser.js';


const getProxyUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.append('disableCache', 'true');
  proxyUrl.searchParams.append('url', url);
  return proxyUrl.toString();
};

const getRssData = (rssUrl) => axios.get(getProxyUrl(rssUrl));

const addIds = (posts, feedId) => {
  posts.forEach((post) => {
    post.id = uniqueId();
    post.feedId = feedId;
  });
};

const handleData = (data, watchedState) => {
  const { feed, posts } = data;
  feed.id = uniqueId();
  watchedState.feeds.push(feed);
  addIds(posts, feed.id);
  watchedState.posts.push(...posts);
};

const refreshFeedContent = (watchedState) => {
  const promises = watchedState.feeds.map((feed) => getRssData(feed.link)
    .then((response) => {
      const { posts } = parseRss(response.data.contents);
      const currentPostsInState = watchedState.posts;
      const postsMatchingFeedId = currentPostsInState.filter((post) => post.feedId === feed.id);
      const processedPostUrls = postsMatchingFeedId.map((post) => post.link);
      const newPosts = posts.filter((post) => !processedPostUrls.includes(post.link));
      addIds(newPosts, feed.id);
      watchedState.posts.unshift(...newPosts);
    })
    .catch((error) => {
      console.error(`Error fetching data from feed ${feed.id}:`, error);
    }));
  return Promise.all(promises).finally(() => setTimeout(refreshFeedContent, 5000, watchedState));
};

const handleError = (error) => {
  if (error.isParsingError) {
    return 'invalidRSS';
  }
  if (axios.isAxiosError(error)) {
    return 'networkError';
  }

  return error.message.key ?? 'unknown';
};


const app = () => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'invalidUrl' }),
      required: () => ({ key: 'requiredField' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'duplicateFeed' }),
    },
  });

  const state = {
    formState: 'filling',
    error: null,
    feeds: [],
    posts: [],
    uiState: {
      displayedPost: null,
      viewedPostIds: new Set(),
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.querySelector('#url-input'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsList: document.querySelector('.posts'),
    feedsList: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
    modalHeader: document.querySelector('.modal-header'),
    modalBody: document.querySelector('.modal-body'),
    modalHref: document.querySelector('.full-article'),
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      const watchedState = onChange(state, handleStateChange(state, elements, i18nextInstance));
      const makeSchema = (validatedLinks) => yup.string()
        .required()
        .url()
        .notOneOf(validatedLinks);

        elements.form.addEventListener('submit', (e) => {
          e.preventDefault();
          const addedLinks = watchedState.feeds.map((feed) => feed.link);
          const schema = makeSchema(addedLinks);
          const formData = new FormData(e.target);
          const input = formData.get('url');
          schema.validate(input)
            .then(() => {
              watchedState.error = null;
              watchedState.formState = 'sending';
              return getRssData(input);
            })
            .then((response) => {
              if (!response.data.contents) {
                throw new Error('invalidRSS');
              }
              const data = parseRss(response.data.contents, input);
              handleData(data, watchedState);
              watchedState.formState = 'added';

            })
            .catch((error) => {
              watchedState.formState = 'invalid';
              watchedState.error =  handleError(error);
            });
        });

        elements.postsList.addEventListener('click', (e) => {
          const postId = e.target.dataset.id;
          if (postId) {
            watchedState.uiState.displayedPost = postId;
            watchedState.uiState.viewedPostIds.add(postId);
          }
        });
        refreshFeedContent(watchedState);
      });
  };

  export default app;