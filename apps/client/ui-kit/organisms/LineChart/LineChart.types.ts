import type { ChartBaseProps } from '../ChartKit';

export type LineChartProps = ChartBaseProps & {
  withArea?: boolean;
};

export type LineChartPlotProps = Omit<LineChartProps, 'ariaLabel' | 'className' | 'formatValue' | 'height'> & {
  width: number;
  height: number;
  formatValue: (value: number) => string;
};
