import { ROUTES } from '@/shared/constants';

export const NAV_ALIASES = [
  { prefix: '/p', href: ROUTES.players.list },
  { prefix: '/c', href: ROUTES.clans.list },
  { prefix: '/t', href: ROUTES.tanks.list },
  { prefix: '/s', href: ROUTES.streamers.list },
  { prefix: '/competitions', href: ROUTES.tournaments.list },
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
