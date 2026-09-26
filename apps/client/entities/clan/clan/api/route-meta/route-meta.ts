import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS } from '@/shared/seo';

import { getClan, listClans } from '../clans';

export const clanRouteName = async (idOrTag: string) => {
  'use cache';

  try {
    const { clan } = await getClan({ idOrTag });

    return `[${clan.tag}] ${clan.name}`;
  } catch {
    return decodeURIComponent(idOrTag);
  }
};

export const topClanTags = async ({ fallback }: RouteStaticParamsInput) => {
  'use cache';

  try {
    const values = (await listClans({ limit: ROUTE_STATIC_PARAMS.limit })).items.map(({ clan }) => clan.tag);

    return values.length > 0 ? values : [fallback];
  } catch {
    return [fallback];
  }
};
