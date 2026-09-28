import { cacheLife } from 'next/cache';

import { vehicleCatalogQuery } from '@/entities/tank/tank';
import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

export const vehicleCatalogPageState = async () => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchQuery(vehicleCatalogQuery())]);
};
