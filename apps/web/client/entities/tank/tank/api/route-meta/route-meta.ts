import type { RouteStaticParamsInput } from '@/shared/seo';

import { lookupRouteEntity, ROUTE_STATIC_PARAMS, routeEntity, routeSlugs } from '@/shared/seo';

import { getTank, listTankStats } from '../tanks';

const lookupTank = async (idOrSlug: string) => {
  'use cache';

  return lookupRouteEntity({ key: idOrSlug, load: async () => (await getTank({ idOrSlug })).vehicle.name });
};

export const tankRouteEntity = async (idOrSlug: string) => routeEntity({ key: idOrSlug, lookup: lookupTank });

export const topTankSlugs = async ({ fallback, limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({
    fallback,
    load: async () => (await listTankStats({ limit })).items.map(({ vehicle }) => vehicle.slug)
  });
};
