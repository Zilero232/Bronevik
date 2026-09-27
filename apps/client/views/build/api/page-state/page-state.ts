import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';

import { buildQueries } from '../build-queries';

export const buildPageState = async (slug: string) => {
  'use cache';
  cacheLife('minutes');

  return prefetchState((client) => [
    client.fetchQuery(buildQueries.tank({ idOrSlug: slug })).then(({ vehicle }) => client.fetchQuery(buildQueries.options(vehicle.tankId)))
  ]);
};
