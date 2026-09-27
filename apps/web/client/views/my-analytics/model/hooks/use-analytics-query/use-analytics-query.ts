'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { usePlus } from '@/features/plus/plus-gate';

import type { AnalyticsQuery, UseAnalyticsQueryInput } from './use-analytics-query.types';

import { analyticsStatus, shouldRetryAnalytics } from '../../../lib/analytics-status';

export const useAnalyticsQuery = <T>({ queryKey, queryFn, requiresPlus }: UseAnalyticsQueryInput<T>): AnalyticsQuery<T> => {
  const { isPlus, isPending: isPlusPending } = usePlus();
  const { data, isPending, error, isFetching, refetch } = useQuery({
    queryKey,
    queryFn,
    enabled: !requiresPlus || isPlus,
    placeholderData: keepPreviousData,
    retry: (failureCount, queryError) => shouldRetryAnalytics({ failureCount, error: queryError })
  });

  return {
    data,
    status: analyticsStatus({ requiresPlus, isPlus, isPlusPending, isPending, error }),
    isPlus,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
