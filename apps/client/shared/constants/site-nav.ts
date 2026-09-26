import { ROUTES } from './routes';

export const SITE_NAV = [
  { key: 'players', href: ROUTES.players },
  { key: 'tanks', href: ROUTES.tanks },
  { key: 'marks', href: ROUTES.marks },
  { key: 'top', href: ROUTES.top },
  { key: 'clans', href: ROUTES.clans },
  { key: 'maps', href: ROUTES.maps },
  { key: 'tools', href: ROUTES.tools }
] as const;

export const SITE_NAV_MORE = [
  { key: 'streamers', href: ROUTES.streamers },
  { key: 'developers', href: ROUTES.developers }
] as const;

export type SiteNavKey = (typeof SITE_NAV_MORE)[number]['key'] | (typeof SITE_NAV)[number]['key'];
