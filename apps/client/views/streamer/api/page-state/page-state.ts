import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';

import { streamerQueries } from '../streamer-queries';

export const streamerPageState = async (slug: string) => {
  'use cache';
  cacheLife('minutes');

  return prefetchState((client) => [client.fetchQuery(streamerQueries.profile(slug))]);
};
