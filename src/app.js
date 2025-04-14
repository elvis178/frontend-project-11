import i18next from 'i18next';
import * as yup from 'yup';
import onChange from 'on-change';
import handleStateChange from './view.js';
import resources from './locales';

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
            })
            .catch((error) => {
              watchedState.formState = 'invalid';
              watchedState.error = error;
            });
        });
      });
  };

  export default app;