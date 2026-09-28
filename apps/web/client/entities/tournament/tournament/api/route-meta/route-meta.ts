import type { RouteStaticParamsInput } from '@/shared/seo';

import { ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { lookupRouteMeta, routeSlugs } from '@/shared/seo/server';

import type { TournamentRouteMeta } from './route-meta.types';

import { getTournament, listTournaments } from '../tournaments';

export const tournamentRouteMeta = async (slug: string): Promise<TournamentRouteMeta | null> => {
  'use cache';

  return lookupRouteMeta(async () => {
    const { title, status } = await getTournament({ slug });

    return { title, isListed: status !== 'draft' };
  });
};

export const tournamentSlugs = async ({ limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput) => {
  'use cache';

  return routeSlugs({
    load: async () => (await listTournaments({ limit })).items.flatMap(({ slug, status }) => (status === 'draft' ? [] : [slug]))
  });
};
