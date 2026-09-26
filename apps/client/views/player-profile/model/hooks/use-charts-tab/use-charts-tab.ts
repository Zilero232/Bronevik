'use client';

import { useState } from 'react';

import type { ChartGranularity, ChartMetric } from '../../../config';

import { HISTORY_CHART } from '../../../config';
import { usePlayerHistory } from '../use-profile-queries';

export const useChartsTab = () => {
  const [metric, setMetric] = useState<ChartMetric>(HISTORY_CHART.defaultMetric);
  const [granularity, setGranularity] = useState<ChartGranularity>(HISTORY_CHART.defaultGranularity);

  const { data: series, isPending, isError, isPlaceholderData, isRefetching, refetch } = usePlayerHistory({ metric, granularity });

  return {
    metric,
    setMetric,
    granularity,
    setGranularity,
    series,
    isLoading: isPending || isPlaceholderData,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
