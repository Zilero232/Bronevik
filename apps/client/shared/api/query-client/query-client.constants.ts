import type { DefaultOptions } from '@tanstack/react-query';

export const QUERY_CLIENT_DEFAULTS = {
  queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false }
} as const satisfies DefaultOptions;
