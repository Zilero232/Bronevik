import type { QUICK_LINKS } from '../../config';

type QuickLinkKey = (typeof QUICK_LINKS)[number];

export type QuickLinkTarget = {
  key: QuickLinkKey;
  href: string;
};
