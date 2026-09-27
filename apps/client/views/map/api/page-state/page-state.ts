import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';

import { mapQueries } from '../map-queries';

export const mapPageState = async (idOrSlug: string) => {
  'use cache';
  cacheLife('minutes');

  return prefetchState((client) => [client.fetchQuery(mapQueries.detail(idOrSlug))]);
};
