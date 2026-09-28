import { dehydrate } from '@tanstack/react-query';
import { cacheLife } from 'next/cache';

import type { PrefetchQueries } from './prefetch-state.types';

import { makeServerQueryClient } from '../query-client';

import 'server-only';

export const prefetchState = async (fetch: PrefetchQueries) => {
  const client = makeServerQueryClient();

  try {
    await Promise.all(fetch(client));

    return dehydrate(client);
  } catch {
    cacheLife('seconds');

    return null;
  }
};
