import type { ChartSeries } from '@/ui-kit';

type ActivityChart = {
  labels: string[];
  series: ChartSeries[];
};

export type ActivityChartsProps = {
  hours: ActivityChart;
  weekdays: ActivityChart;
  formatPercent: (value: number) => string;
};
