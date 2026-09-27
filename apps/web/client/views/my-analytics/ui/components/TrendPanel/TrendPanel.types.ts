import type { ChartSeries } from '@/ui-kit';

export type TrendPanelProps = {
  labels: string[];
  winRate: ChartSeries[];
  damage: ChartSeries[];
  wn8: ChartSeries[];
  formatPercent: (value: number) => string;
  formatNumber: (value: number) => string;
};
