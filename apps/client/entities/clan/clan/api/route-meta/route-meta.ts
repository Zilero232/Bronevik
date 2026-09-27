import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS, routeEntity, routeSlugs } from '@/shared/seo';

import { getClan, listClans } from '../clans';

export const clanRouteEntity = async (idOrTag: string) => {
  'use cache';

  return routeEntity({
    key: idOrTag,
    load: async () => {
      const { clan } = await getClan({ idOrTag });

      return `[${clan.tag}] ${clan.name}`;
    }
  });
};

export const topClanTags = async ({ fallback, limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({
    fallback,
    load: async () => (await listClans({ limit })).items.map(({ clan }) => clan.tag)
  });
};
