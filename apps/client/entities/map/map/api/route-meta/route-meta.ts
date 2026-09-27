import type { RouteStaticParamsInput } from '@/shared/seo';

import { routeEntity, routeSlugs } from '@/shared/seo';

import { getMap, listMaps } from '../maps';

export const mapRouteEntity = async (idOrSlug: string) => {
  'use cache';

  return routeEntity({ key: idOrSlug, load: async () => (await getMap({ idOrSlug })).name });
};

export const mapSlugs = async ({ fallback }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({ fallback, load: async () => (await listMaps({})).map(({ slug }) => slug) });
};
