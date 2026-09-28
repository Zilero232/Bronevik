import type { SearchParams } from 'nuqs/server';

import { cacheLife } from 'next/cache';
import { createLoader } from 'nuqs/server';

import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';
import { achievementsRarityControllerListOptions } from '@/shared/api/query-options';

import type { AchievementsPrefetchInput } from './page-state.types';

import { ACHIEVEMENTS_PARAMS } from '../../config';

const loadAchievementsParams = createLoader(ACHIEVEMENTS_PARAMS);

const prefetchAchievements = async ({ section, sort }: AchievementsPrefetchInput) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [
    client.fetchQuery(achievementsRarityControllerListOptions()),
    client.fetchQuery(achievementsRarityControllerListOptions({ query: { section: section ?? undefined, sort } }))
  ]);
};

export const achievementsPageState = async (search: SearchParams) => {
  const { section, sort } = loadAchievementsParams(search);

  return prefetchAchievements({ section, sort });
};
