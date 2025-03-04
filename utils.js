import * as yup from 'yup';

const validator = (url, urlFeeds) => {
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

export default validator;