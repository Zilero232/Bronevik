export const BLOG_POST_PAGE = {
  staleMs: 5 * 60_000,
  skeletonHeights: [360, 640]
} as const;

export const ARTICLE_SHARE = {
  targets: {
    telegram: { url: 'https://t.me/share/url', titleParam: 'text' },
    vk: { url: 'https://vk.com/share.php', titleParam: 'title' }
  }
} as const;
