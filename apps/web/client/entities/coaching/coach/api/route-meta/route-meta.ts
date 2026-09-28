import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { lookupRouteMeta, routeSlugs } from '@/shared/seo/server';

import type { CoachRouteMeta } from './route-meta.types';

import { getCoach, listCoaches } from '../coaching';

export const coachRouteMeta = async (userId: string): Promise<CoachRouteMeta | null> => {
  'use cache';

  return lookupRouteMeta(async () => {
    const { name, headline, isActive } = await getCoach({ userId });

    return { name, headline, isActive };
  });
};

export const coachIds = async ({ limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({ load: async () => (await listCoaches({ limit })).items.flatMap(({ userId, isActive }) => (isActive ? [userId] : [])) });
};
