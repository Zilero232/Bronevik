import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS, routeEntity, routeSlugs } from '@/shared/seo';

import { getPlayer, getPopularPlayers } from '../players';

export const playerRouteEntity = async (idOrNick: string) => {
  'use cache';

  return routeEntity({ key: idOrNick, load: async () => (await getPlayer({ idOrNick })).summary.nickname });
};

export const popularNicknames = async ({ limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({ load: async () => (await getPopularPlayers({ limit })).items.map(({ nickname }) => nickname) });
};
