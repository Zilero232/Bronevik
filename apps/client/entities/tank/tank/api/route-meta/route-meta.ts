import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS, routeEntity, routeSlugs } from '@/shared/seo';

import { getTank, listTankStats } from '../tanks';

export const tankRouteEntity = async (idOrSlug: string) => {
  'use cache';

  return routeEntity({ key: idOrSlug, load: async () => (await getTank({ idOrSlug })).vehicle.name });
};

export const topTankSlugs = async ({ fallback, limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({
    fallback,
    load: async () => (await listTankStats({ limit })).items.map(({ vehicle }) => vehicle.slug)
  });
};
