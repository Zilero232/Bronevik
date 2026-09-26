'use client';

import { getAnalyticsPlatoons } from '@/entities/player/analytics';
import { QUERY_KEYS } from '@/shared/constants';

import { useAnalyticsFilters } from '../../context';
import { useAnalyticsQuery } from '../use-analytics-query';
import { useMatesColumns } from '../use-mates-columns';

export const useAnalyticsPlatoons = () => {
  const { account, period } = useAnalyticsFilters();
  const { data, status, isRetrying, retry } = useAnalyticsQuery({
    queryKey: QUERY_KEYS.me.analytics.platoons({ account, period }),
    queryFn: ({ signal }) => getAnalyticsPlatoons({ account, period, signal }),
    requiresPlus: true
  });

  const columns = useMatesColumns();

  return { data, status, isRetrying, retry, isUntracked: data?.tracked === 0, columns };
};
