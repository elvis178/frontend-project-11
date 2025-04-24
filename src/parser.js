const parsePostItem = (post) => {
  const link = post.querySelector('link')?.textContent;
  const title = post.querySelector('title')?.textContent;
  const description = post.querySelector('description')?.textContent;
  
  if (!link || !title) {
    throw new Error('invalidRSS');
  }

  return {
    link,
    title,
    description: description || '',
  };
};

const parseRss = (rss, url) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(rss, 'text/xml');

  const parseError = data.querySelector('parsererror');
  if (parseError) {
    throw new Error('invalidRSS');
  }

  const rssElement = data.querySelector('rss');
  if (!rssElement) {
    throw new Error('invalidRSS');
  }

  const channel = data.querySelector('channel');
  if (!channel) {
    throw new Error('invalidRSS');
  }

  const feedTitle = channel.querySelector('title')?.textContent;
  const feedDescription = channel.querySelector('description')?.textContent;

  if (!feedTitle) {
    throw new Error('invalidRSS');
  }

  const feed = {
    link: url,
    title: feedTitle,
    description: feedDescription || '',
  };

  try {
    const posts = [...channel.querySelectorAll('item')].map(parsePostItem);
    return { feed, posts };
  } catch (e) {
    throw new Error('invalidRSS');
  }
};

export default parseRss;