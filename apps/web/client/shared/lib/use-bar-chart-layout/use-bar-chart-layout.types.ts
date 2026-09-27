import type { ChartLayoutInput, ChartScaleSeries } from '../chart-scale';

export type UseBarChartLayoutInput = Omit<ChartLayoutInput, 'includeZero' | 'series'> & {
  series: (ChartScaleSeries & { id: string })[];
};
