import { ROUTES } from './routes';

export const SITE_NAV = [
  { key: 'players', href: ROUTES.players },
  { key: 'tanks', href: ROUTES.tanks },
  { key: 'builds', href: ROUTES.builds },
  { key: 'marks', href: ROUTES.marks },
  { key: 'missions', href: ROUTES.missions },
  { key: 'top', href: ROUTES.top },
  { key: 'clans', href: ROUTES.clans },
  { key: 'maps', href: ROUTES.maps },
  { key: 'tools', href: ROUTES.tools }
] as const;

export const SITE_NAV_MORE = [
  { key: 'news', href: ROUTES.news },
  { key: 'events', href: ROUTES.events },
  { key: 'shop', href: ROUTES.shop },
  { key: 'codes', href: ROUTES.codes },
  { key: 'pulse', href: ROUTES.pulse },
  { key: 'streamers', href: ROUTES.streamers },
  { key: 'developers', href: ROUTES.developers }
] as const;

export const SITE_NAV_COMMUNITY = [
  { key: 'replays', href: ROUTES.replays },
  { key: 'guides', href: ROUTES.guides },
  { key: 'tactics', href: ROUTES.tactics },
  { key: 'platoons', href: ROUTES.platoons },
  { key: 'recruiting', href: ROUTES.recruiting },
  { key: 'coaching', href: ROUTES.coaching },
  { key: 'tournaments', href: ROUTES.tournaments }
] as const;

export type SiteNavKey = (typeof SITE_NAV_COMMUNITY)[number]['key'] | (typeof SITE_NAV_MORE)[number]['key'] | (typeof SITE_NAV)[number]['key'];
