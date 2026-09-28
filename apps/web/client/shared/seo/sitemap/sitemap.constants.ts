import { PAGINATION } from '@otmetki/schemas';

import { LEGAL } from '@/shared/config';
import { ROUTES } from '@/shared/constants';

export const SITEMAP = {
  limit: PAGINATION.maxLimit,
  path: '/sitemap.xml',
  allow: ['/', '/api/og/'],
  disallow: ['/me', '/api/', '/overlay/', '/serwist/', ROUTES.miniApp, ROUTES.vkMiniApp, ROUTES.auth.login, ROUTES.design]
} as const;

export const SITEMAP_STATIC_PATHS = [
  ROUTES.home,
  ROUTES.players.list,
  ROUTES.players.compare,
  ROUTES.top,
  ROUTES.bestBattles,
  ROUTES.achievements,
  ROUTES.clans.list,
  ROUTES.tanks.list,
  ROUTES.tanks.compare,
  ROUTES.builds.list,
  ROUTES.marks,
  ROUTES.modes.list,
  ROUTES.tree,
  ROUTES.supertest,
  ROUTES.maps.list,
  ROUTES.missions.hub,
  ROUTES.events,
  ROUTES.codes,
  ROUTES.shop,
  ROUTES.news,
  ROUTES.pulse,
  ROUTES.honestRng,
  ROUTES.play.guessTank,
  ROUTES.streamers.list,
  ROUTES.streamers.forStreamers,
  ROUTES.streamers.settings.table,
  ROUTES.replays.list,
  ROUTES.guides.list,
  ROUTES.tactics.list,
  ROUTES.platoons,
  ROUTES.recruiting,
  ROUTES.coaching.list,
  ROUTES.tournaments.list,
  ROUTES.tools,
  ROUTES.mod,
  ROUTES.plus,
  ROUTES.developers,
  ...(LEGAL.isDraft ? [] : [ROUTES.legal.privacy, ROUTES.legal.terms, ROUTES.legal.contacts])
] as const;
