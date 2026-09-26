import type { QueryKey } from '@tanstack/react-query';

export type UseAnalyticsQueryInput<T> = {
  queryKey: QueryKey;
  queryFn: (input: { signal: AbortSignal }) => Promise<T>;
  requiresPlus: boolean;
};
