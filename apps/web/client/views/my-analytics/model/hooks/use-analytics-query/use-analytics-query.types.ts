import type { QueryKey } from '@tanstack/react-query';

import type { AnalyticsStatus } from '../../../lib/analytics-status';

export type UseAnalyticsQueryInput<T> = {
  queryKey: QueryKey;
  queryFn: (input: { signal: AbortSignal }) => Promise<T>;
  requiresPlus: boolean;
};

export type AnalyticsQuery<T> = {
  data: T | undefined;
  status: AnalyticsStatus;
  isPlus: boolean;
  isRetrying: boolean;
  retry: () => void;
};
