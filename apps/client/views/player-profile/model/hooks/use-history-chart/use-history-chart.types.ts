import type { TimeSeries, TimeSeriesMetric } from '@bronevik/schemas';

export type UseHistoryChartInput = {
  metric: TimeSeriesMetric;
  series?: TimeSeries;
};
