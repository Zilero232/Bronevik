import type { ARTICLE_SHARE } from '../../config';

export type ShareTarget = keyof typeof ARTICLE_SHARE.targets;

export type ShareLinksInput = {
  url: string;
  title: string;
};

export type ShareLink = {
  target: ShareTarget;
  href: string;
};
