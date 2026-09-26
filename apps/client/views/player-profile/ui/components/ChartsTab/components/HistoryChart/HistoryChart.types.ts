import type { TimeSeries, TimeSeriesMetric } from '@bronevik/schemas';

export type HistoryChartProps = {
  metric: TimeSeriesMetric;
  series?: TimeSeries;
  isLoading: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry: () => void;
};
