export const BLOG_FEED = {
  contentType: 'application/rss+xml; charset=utf-8',
  cacheControl: 'public, max-age=900',
  limit: 30,
  path: '/blog',
  enPrefix: '/en',
  feedPath: '/blog/rss.xml',
  title: 'Три отметки — блог',
  description: 'Новости проекта, разборы патчей и аналитика от команды «Три отметки»'
} as const;
