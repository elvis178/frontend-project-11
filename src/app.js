import i18next from 'i18next';
import 'bootstrap';
import _ from 'lodash';
import axios from 'axios';
import render from './view.js';
import ru from './locales/ru.js';
import parseRss from './parser.js';
import createUrlValidator, { getProxyUrl } from '../utils.js';

const state = {
  form: {
    status: 'pending',
    errors: '',
  },
  loadingProcess: {
    status: 'sending',
    error: '',
  },
  posts: [],
  feeds: [],
  ui: {
    activePostId: '',
    touchedPostId: new Set(),
  },
};

const elements = {
  staticEl: {
    title: document.querySelector('h1'),
    subtitle: document.querySelector('.lead'),
    label: document.querySelector('[for="url-input"]'),
    button: document.querySelector('[type="submit"]'),
  },
  form: document.querySelector('form'),
  input: document.getElementById('url-input'),
  errorElement: document.querySelector('.feedback'),
  postsContainer: document.querySelector('.posts'),
};



const timeout = 5000;

export default () => {
  const defaultLanguage = 'ru';
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources: { ru },
  }).then(() => {
    const { watchedState, renderFormView } = render (elements, i18nextInstance, state);

    renderFormView();

    const refreshFeedContent = (feeds) => {
      const promises = feeds.map(({ url }) => axios.get(getProxyUrl(url))
        .then((responce) => {
          const parseData = parseRss(responce.data.contents);
          const { posts } = parseData;
          const existPosts = watchedState.posts.map((post) => post.url);
          const newPosts = posts.filter((post) => !existPosts.includes(post.url));
          const updatePosts = newPosts.map((post) => ({ ...post, id: _.uniqueId() }));
          watchedState.posts = [...updatePosts, ...watchedState.posts];
        })
        .catch((e) => {
          throw e;
        }));

      Promise.all(promises)
        .finally(() => {
          setTimeout(() => refreshFeedContent(watchedState.feeds), timeout);
        });
    };

    refreshFeedContent(watchedState.feeds);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const urlTarget = formData.get('url').trim();
      const urlFeeds = watchedState.feeds.map(({ url }) => url);

      watchedState.loadingProcess.status = 'sending';

      createUrlValidator(urlTarget, urlFeeds)
        .then(({ url }) => axios.get(getProxyUrl(url)))
        .then((responce) => {
          const parseData = parseRss(responce.data.contents);
          const { feed, posts } = parseData;
          watchedState.feeds.push({ ...feed, feedId: _.uniqueId(), url: urlTarget });
          posts.forEach((post) => watchedState.posts.push({ ...post, id: _.uniqueId() }));
          watchedState.loadingProcess.status = 'finished';
          watchedState.loadingProcess.error = '';
        })
        .catch((error) => {
          if (error.isAxiosError) {
            watchedState.loadingProcess.error = 'networkError';
          } else if (error.message === 'invalidRSS') {
            watchedState.loadingProcess.error = 'invalidRSS';
          } else {
            watchedState.form.errors = error.message;
          }
        });
    });

    elements.postsContainer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        watchedState.ui.touchedPostId.add(e.target.id);
      }
      if (e.target.tagName === 'BUTTON') {
        watchedState.ui.touchedPostId.add(e.target.dataset.id);
        watchedState.ui.activePostId = e.target.dataset.id;
      }
    });
  });
};