import type { TimeSeries, TimeSeriesMetric } from '@otmetki/schemas';

export type UseHistoryChartInput = {
  metric: TimeSeriesMetric;
  series?: TimeSeries;
};
