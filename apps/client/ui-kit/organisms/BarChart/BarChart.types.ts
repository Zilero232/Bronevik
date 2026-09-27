import type { ChartBaseProps } from '../ChartKit';

export type BarChartProps = ChartBaseProps;

export type BarChartPlotProps = Omit<BarChartProps, 'ariaLabel' | 'className' | 'formatValue' | 'hasTableToggle' | 'height'> & {
  width: number;
  height: number;
  formatValue: (value: number) => string;
};
