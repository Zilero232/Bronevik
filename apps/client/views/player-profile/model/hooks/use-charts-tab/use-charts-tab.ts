'use client';

import { useState } from 'react';

import type { ChartGranularity, ChartMetric } from '../../../model/profile.types';

import { HISTORY_CHART } from '../../../config';
import { usePlayerHistory } from '../use-profile-queries';

export const useChartsTab = () => {
  const [metric, setMetric] = useState<ChartMetric>(HISTORY_CHART.defaultMetric);
  const [granularity, setGranularity] = useState<ChartGranularity>(HISTORY_CHART.defaultGranularity);

  const query = usePlayerHistory({ metric, granularity });

  return {
    metric,
    setMetric,
    granularity,
    setGranularity,
    query: {
      data: query.isPlaceholderData ? undefined : query.data,
      isError: query.isError,
      isRefetching: query.isRefetching,
      refetch: query.refetch
    }
  };
};
