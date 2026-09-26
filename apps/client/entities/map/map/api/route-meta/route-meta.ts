import type { RouteStaticParamsInput } from '@/shared/seo';

import { getMap, listMaps } from '../maps';

export const mapRouteName = async (idOrSlug: string) => {
  'use cache';

  try {
    return (await getMap({ idOrSlug })).name;
  } catch {
    return decodeURIComponent(idOrSlug);
  }
};

export const mapSlugs = async ({ fallback }: RouteStaticParamsInput) => {
  'use cache';

  try {
    const values = (await listMaps({})).map(({ slug }) => slug);

    return values.length > 0 ? values : [fallback];
  } catch {
    return [fallback];
  }
};
