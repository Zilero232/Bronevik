import { entries } from 'remeda';

import type { ShareLink, ShareLinksInput } from './share-links.types';

import { ARTICLE_SHARE } from '../../config';

export const shareLinks = ({ url, title }: ShareLinksInput): ShareLink[] =>
  entries(ARTICLE_SHARE.targets).map(([target, { url: base, titleParam }]) => ({
    target,
    href: `${base}?${new URLSearchParams({ url, [titleParam]: title }).toString()}`
  }));
