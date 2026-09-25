import type { ChartBaseProps } from '../ChartKit';

export type BarChartProps = ChartBaseProps;

export type BarChartPlotProps = Omit<BarChartProps, 'ariaLabel' | 'className' | 'formatValue' | 'height'> & {
  width: number;
  height: number;
  formatValue: (value: number) => string;
};
