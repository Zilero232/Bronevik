import type { RouteStaticParamsInput } from './route-meta.types';

import { getClan, listClans } from '../../api/clans';
import { getMap, listMaps } from '../../api/maps';
import { getStreamerBySlug } from '../../api/streamers';
import { getTank, listTankStats } from '../../api/tanks';
import { ROUTE_STATIC_PARAMS } from './route-meta.constants';

export const tankRouteName = async (idOrSlug: string) => {
  'use cache';

  try {
    return (await getTank({ idOrSlug })).vehicle.name;
  } catch {
    return decodeURIComponent(idOrSlug);
  }
};

export const clanRouteName = async (idOrTag: string) => {
  'use cache';

  try {
    const { clan } = await getClan({ idOrTag });

    return `[${clan.tag}] ${clan.name}`;
  } catch {
    return decodeURIComponent(idOrTag);
  }
};

export const mapRouteName = async (idOrSlug: string) => {
  'use cache';

  try {
    return (await getMap({ idOrSlug })).name;
  } catch {
    return decodeURIComponent(idOrSlug);
  }
};

export const streamerRouteName = async (slug: string) => {
  'use cache';

  try {
    return (await getStreamerBySlug(slug)).displayName;
  } catch {
    return slug;
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

export const topClanTags = async ({ fallback }: RouteStaticParamsInput) => {
  'use cache';

  try {
    const values = (await listClans({ limit: ROUTE_STATIC_PARAMS.limit })).items.map(({ clan }) => clan.tag);

    return values.length > 0 ? values : [fallback];
  } catch {
    return [fallback];
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
