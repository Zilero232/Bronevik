import type { SearchParams } from 'nuqs/server';

import { cacheLife } from 'next/cache';
import { createLoader } from 'nuqs/server';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

import { TOP_PARAMS } from '../../config';
import { toLeaderboardFilter } from '../../lib/top-filter';
import { topQueries } from '../top-queries';

const loadTopParams = createLoader(TOP_PARAMS);

const prefetchBoard = async (filter: LeaderboardFilter) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchQuery(topQueries.board(filter))]);
};

export const topPageState = async (search: SearchParams) => prefetchBoard(toLeaderboardFilter(loadTopParams(search)));
