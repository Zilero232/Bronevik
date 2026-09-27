'use client';

import { sortBy } from 'remeda';

import { getFirstWin } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';

import type { AnalyticsStatus } from '../../../lib/analytics-status';

import { useAnalyticsFilters } from '../../context';
import { useAnalyticsQuery } from '../use-analytics-query';

export const useFirstWin = () => {
  const { account } = useAnalyticsFilters();
  const { data, status, isRetrying, retry } = useAnalyticsQuery({
    queryKey: QUERY_KEYS.me.analytics.firstWin({ account }),
    queryFn: ({ signal }) => getFirstWin({ account, signal }),
    requiresPlus: false
  });

  const resolved: AnalyticsStatus = data?.state === 'noLink' ? 'noAccount' : status;

  return {
    data,
    status: resolved,
    isNoGarage: data?.state === 'noGarage',
    tanks: sortBy(data?.tanks ?? [], [(item) => Number(item.isTaken), 'asc'], [(item) => item.vehicle.tier, 'desc']),
    isRetrying,
    retry
  };
};
