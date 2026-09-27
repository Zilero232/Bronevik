import { dehydrate } from '@tanstack/react-query';

import type { PrefetchQueries } from './prefetch-state.types';

import { makeServerQueryClient } from '../query-client';

import 'server-only';

export const prefetchState = async (fetch: PrefetchQueries) => {
  const client = makeServerQueryClient();

  await Promise.all(fetch(client));

  return dehydrate(client);
};
