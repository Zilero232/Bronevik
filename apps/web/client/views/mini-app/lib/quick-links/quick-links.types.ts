import type { QUICK_LINKS } from '../../config/quick-links.constants';

export type QuickLinkKey = (typeof QUICK_LINKS)[number];

export type QuickLinkTarget = {
  key: QuickLinkKey;
  href: string;
};
