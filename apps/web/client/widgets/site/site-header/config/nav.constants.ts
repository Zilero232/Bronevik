import { isIncludedIn } from 'remeda';

import { ROUTES, SITE_FOOTER_GROUPS } from '@/shared/constants';

export const NAV_ALIASES = [
  { prefix: '/p', href: ROUTES.players.list },
  { prefix: '/c', href: ROUTES.clans.list },
  { prefix: '/s', href: ROUTES.streamers.list },
  { prefix: '/competitions', href: ROUTES.tournaments.list },
  { prefix: ROUTES.social.feed, href: ROUTES.social.leagues },
  { prefix: ROUTES.social.challenges, href: ROUTES.social.leagues },
  { prefix: '/play', href: ROUTES.tools }
] as const;

export const NAV_MENU = {
  openDelay: 80,
  closeDelay: 120,
  sideOffset: 0,
  compactAbove: 80,
  expandBelow: 16,
  featuredTier: 10,
  featuredLimit: 10,
  featuredPeriod: '7d',
  featuredStaleMs: 30 * 60_000,
  eventsStaleMs: 10 * 60_000,
  liveStaleMs: 60_000,
  eventDateFormat: { day: 'numeric', month: 'long' },
  featuredSkeletonHeight: 150
} as const satisfies Record<string, number | string | Intl.DateTimeFormatOptions>;

export const MOBILE_NAV = {
  projectKey: 'project',
  projectItems: SITE_FOOTER_GROUPS.flatMap(({ items }) => [...items]).filter(({ key }) =>
    isIncludedIn(key, ['mod', 'forStreamers', 'developers', 'pulse'] as const)
  )
} as const;
