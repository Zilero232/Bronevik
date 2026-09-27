import type { TimeSeriesGranularity, TimeSeriesMetric } from '@otmetki/schemas';

export type UsePlayerHistoryInput = {
  metric: TimeSeriesMetric;
  granularity: TimeSeriesGranularity;
};
