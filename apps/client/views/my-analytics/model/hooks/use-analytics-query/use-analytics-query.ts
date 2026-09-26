'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { usePlus } from '@/features/plus/plus-gate';

import type { UseAnalyticsQueryInput } from './use-analytics-query.types';

import { analyticsStatus, shouldRetryAnalytics } from '../../../lib/analytics-status';

export const useAnalyticsQuery = <T>({ queryKey, queryFn, requiresPlus }: UseAnalyticsQueryInput<T>) => {
  const { isPlus, isPending: isPlusPending } = usePlus();
  const query = useQuery({
    queryKey,
    queryFn,
    enabled: !requiresPlus || isPlus,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => shouldRetryAnalytics({ failureCount, error })
  });

  return {
    data: query.data,
    status: analyticsStatus({ requiresPlus, isPlus, isPlusPending, isPending: query.isPending, error: query.error }),
    isPlus,
    isRetrying: query.isFetching,
    retry: () => void query.refetch()
  };
};
