import type { RouteStaticParamsInput } from '@/shared/seo';

import { lookupRouteEntity, ROUTE_STATIC_PARAMS, routeEntity, routeSlugs } from '@/shared/seo';

import { getPlayer, getPopularPlayers } from '../players';

const lookupPlayer = async (idOrNick: string) => {
  'use cache';

  return lookupRouteEntity({ key: idOrNick, load: async () => (await getPlayer({ idOrNick })).summary.nickname });
};

export const playerRouteEntity = async (idOrNick: string) => routeEntity({ key: idOrNick, lookup: lookupPlayer });

export const popularNicknames = async ({ limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({ load: async () => (await getPopularPlayers({ limit })).items.map(({ nickname }) => nickname) });
};
