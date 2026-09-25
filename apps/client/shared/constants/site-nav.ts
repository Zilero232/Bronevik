import { ROUTES } from './routes';

export const SITE_NAV = [
  { key: 'players', href: ROUTES.players },
  { key: 'tanks', href: ROUTES.tanks },
  { key: 'marks', href: ROUTES.marks },
  { key: 'top', href: ROUTES.top },
  { key: 'clans', href: ROUTES.clans },
  { key: 'tools', href: ROUTES.tools },
  { key: 'streamers', href: ROUTES.streamers },
  { key: 'developers', href: ROUTES.developers }
] as const;

export type SiteNavKey = (typeof SITE_NAV)[number]['key'];
