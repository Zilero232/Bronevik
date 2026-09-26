import type { TimeSeriesGranularity, TimeSeriesMetric } from '@bronevik/schemas';

export type UsePlayerHistoryInput = {
  metric: TimeSeriesMetric;
  granularity: TimeSeriesGranularity;
};
