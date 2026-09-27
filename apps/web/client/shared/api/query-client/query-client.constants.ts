import type { DefaultOptions } from '@tanstack/react-query';

import { secondsToMilliseconds } from 'date-fns';

export const QUERY_CLIENT_DEFAULTS = {
  queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false }
} as const satisfies DefaultOptions;

export const SERVER_QUERY_CLIENT_DEFAULTS = {
  queries: { ...QUERY_CLIENT_DEFAULTS.queries, retry: false }
} as const satisfies DefaultOptions;

export const PREFETCH_CACHE_LIFE = { stale: 300, revalidate: 120, expire: 300 } as const;

export const PREFETCHED_STALE_TIME = secondsToMilliseconds(PREFETCH_CACHE_LIFE.expire);
