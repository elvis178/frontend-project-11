import * as yup from 'yup';
import local from './src/locales/locales.js';

export const getProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};

yup.setLocale(local);

const createUrlValidator = (url, urlFeeds) => {
  const schema = yup.object().shape({
    url: yup
      .string()
      .transform(value => value?.trim())
      .url('errors.invalidUrl')
      .required()
      .notOneOf(urlFeeds, 'errors.existsRss'),
  });
  return schema.validate({ url });
};


export default createUrlValidator;