import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';

import { TANK_URL_PARSERS } from '../../config';
import { tankQueries } from '../tank-queries';

export const tankPageState = async (slug: string) => {
  'use cache';
  cacheLife('minutes');

  return prefetchState((client) => [client.fetchQuery(tankQueries.detail({ idOrSlug: slug, period: TANK_URL_PARSERS.period.defaultValue }))]);
};
