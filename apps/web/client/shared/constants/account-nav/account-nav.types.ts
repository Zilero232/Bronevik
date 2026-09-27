import type { SiteNavIcon } from '../site-nav';

export type AccountNavLink = {
  key: string;
  href: string;
  icon: SiteNavIcon;
};

export type AccountNavGroup = {
  key: string;
  items: readonly AccountNavLink[];
};
