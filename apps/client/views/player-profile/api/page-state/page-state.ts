import { cacheLife } from 'next/cache';

import { playerQueries } from '@/entities/player/profile';
import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

export const playerPageState = async (nickname: string) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchQuery(playerQueries.profile(nickname))]);
};
