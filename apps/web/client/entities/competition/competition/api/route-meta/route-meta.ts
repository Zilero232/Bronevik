import { lookupRouteMeta } from '@/shared/seo/server';

import type { CompetitionRouteMeta } from './route-meta.types';

import { getCompetition } from '../competitions';

export const competitionRouteMeta = async (slug: string): Promise<CompetitionRouteMeta | null> => {
  'use cache';

  return lookupRouteMeta(async () => {
    const { title, visibility } = await getCompetition({ slug });

    return { title, isPublic: visibility === 'public' };
  });
};
