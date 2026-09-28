import type { RouteStaticParamsInput } from '@/shared/seo';

import { lookupRouteEntity, routeEntity, routeSlugs } from '@/shared/seo/server';

import { getMap, listMaps } from '../maps';

const lookupMap = async (idOrSlug: string) => {
  'use cache';

  return lookupRouteEntity({ key: idOrSlug, load: async () => (await getMap({ idOrSlug })).name });
};

export const mapRouteEntity = async (idOrSlug: string) => routeEntity({ key: idOrSlug, lookup: lookupMap });

export const mapSlugs = async ({ fallback }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({ fallback, load: async () => (await listMaps({})).map(({ slug }) => slug) });
};
