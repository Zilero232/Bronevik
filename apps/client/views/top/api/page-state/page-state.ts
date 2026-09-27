import type { SearchParams } from 'nuqs/server';

import { cacheLife } from 'next/cache';
import { createLoader } from 'nuqs/server';

import { prefetchState } from '@/shared/api/prefetch-state';

import { TOP_PARAMS } from '../../config';
import { toLeaderboardFilter } from '../../lib/top-filter';
import { topQueries } from '../top-queries';

const loadTopParams = createLoader(TOP_PARAMS);

export const topPageState = async (search: SearchParams) => {
  'use cache';
  cacheLife('minutes');

  return prefetchState((client) => [client.fetchQuery(topQueries.board(toLeaderboardFilter(loadTopParams(search))))]);
};
