import { cacheLife } from 'next/cache';

import { prefetchState } from '@/shared/api/prefetch-state';

import { clanQueries } from '../clan-queries';

export const clanPageState = async (tag: string) => {
  'use cache';
  cacheLife('minutes');

  return prefetchState((client) => [client.fetchQuery(clanQueries.page(tag))]);
};
