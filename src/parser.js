const parsePostItem = (itemElement) => {
  const linkElement = itemElement.querySelector('link');
  const titleElement = itemElement.querySelector('title');
  const descriptionElement = itemElement.querySelector('description');

  const link = linkElement ? linkElement.textContent : null;
  const title = titleElement ? titleElement.textContent : null;
  const description = descriptionElement ? descriptionElement.textContent : '';

  if (!link || !title) {
    const parsingError = new Error('invalidRSS');
    throw parsingError;
  }

  return {
    link,
    title,
    description,
  };
};

const parseRss = (xmlContent, feedUrl) => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(xmlContent, 'text/xml');

  if (parsedDocument.querySelector('parsererror')) {
    const parsingError = new Error('invalidRSS');
    throw parsingError;
  }

  const rssElement = parsedDocument.querySelector('rss');
  const channelElement = parsedDocument.querySelector('channel');
  const channelTitleElement = channelElement ? channelElement.querySelector('title') : null;

  if (!rssElement || !channelElement || !channelTitleElement) {
    const structureError = new Error('invalidRSS');
    throw structureError;
  }

  const feed = {
    link: feedUrl,
    title: channelTitleElement.textContent,
    description: channelElement.querySelector('description')?.textContent || '',
  };

  const postElements = channelElement.querySelectorAll('item');
  const posts = Array.from(postElements).map((element) => parsePostItem(element));

  return { feed, posts };
};

export default parseRss;