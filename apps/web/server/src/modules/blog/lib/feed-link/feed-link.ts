import type { BlogFeedLinkInput } from './feed-link.types';

import { BLOG, BLOG_FEED } from '../../config';

export const blogFeedLink = ({ webUrl, locale, slug }: BlogFeedLinkInput): string => {
  const prefix = locale === BLOG.defaultLocale ? '' : BLOG_FEED.enPrefix;
  const path = slug ? `${BLOG_FEED.path}/${encodeURIComponent(slug)}` : BLOG_FEED.path;

  return new URL(`${prefix}${path}`, webUrl).href;
};
