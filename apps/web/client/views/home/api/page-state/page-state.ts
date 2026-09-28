import { cacheLife } from 'next/cache';

import { pulseQueries } from '@/entities/pulse/pulse';
import { gameStatusQueries } from '@/entities/reference/game-status';
import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

export const homePageState = async () => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [
    client.fetchQuery(gameStatusQueries.version()),
    client.fetchQuery(gameStatusQueries.servers()),
    client.fetchQuery(pulseQueries.current())
  ]);
};
