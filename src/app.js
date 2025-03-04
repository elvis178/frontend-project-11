import i18next from 'i18next';
import validator from './validator.js';
import initView from './view.js';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  feedbackContainer: document.querySelector('.feedback'),
  postsContainer: document.querySelector('.posts'),
  feedsContainer: document.querySelector('.feeds'),
  staticEl: {
    title: document.querySelector('h1'),
    subtitle: document.querySelector('.lead'),
    label: document.querySelector('[for="url-input"]'),
    button: document.querySelector('[type="submit"]'),
  },
};

const state = {
  form: {
    status: 'filling', // filling, processing, success, error
    isValid: true,
    error: '',
  },
  feeds: [],
  posts: [],
};

i18next.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: {
      translation: {
        errors: {
          invalidUrl: 'Ссылка должна быть валидным URL',
          existsRss: 'RSS уже существует',
        },
        feedback: {
          success: 'RSS успешно загружен',
        },
      },
    },
  },
}).then(() => {
  const watchedState = initView(state, elements, i18next);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    const urlFeeds = state.feeds.map((feed) => feed.url);

    try {
      watchedState.form.status = 'processing';
      await validator(url, urlFeeds); // Валидация

      // Если валидация прошла успешно
      watchedState.form.status = 'success';
      watchedState.feeds.push({ url }); // Добавляем URL в список фидов
    } catch (err) {
      watchedState.form.status = 'error';
      watchedState.form.error = err.message; // Устанавливаем ошибку
    }
  });
});

