import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

import { plusQueries } from '../plus-queries';

export const plusPageState = async () => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchQuery(plusQueries.plans())]);
};
