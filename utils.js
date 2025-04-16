import * as yup from 'yup';
import resources from './src/locales/locales.js';

export const getProxyUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app/get?');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

yup.setLocale(resources);

const validate = (url, urlFeeds) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .url('errors.invalidUrl')
      .trim()
      .required()
      .notOneOf(urlFeeds, 'errors.existsRss'),
  });
  return schema.validate({ url });
};

export default validate;