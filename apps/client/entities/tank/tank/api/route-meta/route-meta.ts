import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS } from '@/shared/seo';

import { getTank, listTankStats } from '../tanks';

export const tankRouteName = async (idOrSlug: string) => {
  'use cache';

  try {
    return (await getTank({ idOrSlug })).vehicle.name;
  } catch {
    return decodeURIComponent(idOrSlug);
  }
};

export const topTankSlugs = async ({ fallback }: RouteStaticParamsInput) => {
  'use cache';

  try {
    const values = (await listTankStats({ limit: ROUTE_STATIC_PARAMS.limit })).items.map(({ vehicle }) => vehicle.slug);

    return values.length > 0 ? values : [fallback];
  } catch {
    return [fallback];
  }
};
