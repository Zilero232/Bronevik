import type { RouteStaticParamsInput } from '@/shared/seo';

import { streamersControllerList } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';
import { lookupRouteEntity, ROUTE_STATIC_PARAMS, routeEntity, routeSlugs } from '@/shared/seo';

import { getStreamerBySlug } from '../streamers';

const lookupStreamer = async (slug: string) => {
  'use cache';

  return lookupRouteEntity({ key: slug, load: async () => (await getStreamerBySlug(slug)).displayName });
};

export const streamerRouteEntity = async (slug: string) => routeEntity({ key: slug, lookup: lookupStreamer });

export const streamerSlugs = async ({ limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({ load: async () => (await fromSdk(() => streamersControllerList({ query: { limit } }))).items.map(({ slug }) => slug) });
};
