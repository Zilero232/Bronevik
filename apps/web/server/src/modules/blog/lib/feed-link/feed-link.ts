import type { BlogFeedLinkInput } from './feed-link.types';

import { BLOG_FEED } from '../../config';

export const blogFeedLink = ({ webUrl, locale, slug }: BlogFeedLinkInput): string => {
  const prefix = locale === BLOG_FEED.defaultLocale ? '' : BLOG_FEED.enPrefix;
  const path = slug ? `${BLOG_FEED.path}/${encodeURIComponent(slug)}` : BLOG_FEED.path;

  return new URL(`${prefix}${path}`, webUrl).href;
};
