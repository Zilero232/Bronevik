import type { ComponentType } from 'react';

import type { SITE_FOOTER_GROUPS, SITE_NAV } from './site-nav';

type SiteNavIconProps = {
  size?: number | string;
  strokeWidth?: number | string;
  className?: string;
};

export type SiteNavIcon = ComponentType<SiteNavIconProps>;

type SiteNavFeatured = 'currentEvent' | 'liveStreamers' | 'topTank';

export type SiteNavLink = {
  key: string;
  href: string;
  icon: SiteNavIcon;
};

export type SiteNavGroup = {
  key: string;
  featured: SiteNavFeatured | null;
  items: readonly SiteNavLink[];
};

export type SiteNavGroupEntry = (typeof SITE_NAV.groups)[number];

export type SiteNavItem =
  (typeof SITE_FOOTER_GROUPS)[number]['items'][number] | SiteNavGroupEntry['items'][number] | typeof SITE_NAV.plus | typeof SITE_NAV.tools;
