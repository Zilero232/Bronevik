import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

import { streamerQueries } from '../streamer-queries';

export const streamerPageState = async (slug: string) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchQuery(streamerQueries.profile(slug))]);
};
