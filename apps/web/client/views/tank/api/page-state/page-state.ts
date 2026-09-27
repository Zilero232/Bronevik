import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';
import { PREFETCH_CACHE_LIFE } from '@/shared/api/query-client';

import { TANK_URL_PARSERS } from '../../config';
import { tankQueries } from '../tank-queries';

export const tankPageState = async (slug: string) => {
  'use cache';
  cacheLife(PREFETCH_CACHE_LIFE);

  return prefetchState((client) => [client.fetchQuery(tankQueries.detail({ idOrSlug: slug, period: TANK_URL_PARSERS.period.defaultValue }))]);
};
