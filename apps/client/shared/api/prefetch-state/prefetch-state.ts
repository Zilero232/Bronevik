import { dehydrate } from '@tanstack/react-query';

import type { PrefetchQueries } from './prefetch-state.types';

import { makeQueryClient } from '../query-client';

import 'server-only';

export const prefetchState = async (fetch: PrefetchQueries) => {
  const client = makeQueryClient();

  await Promise.all(fetch(client));

  return dehydrate(client);
};
