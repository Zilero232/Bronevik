import type { ChartBaseProps, ChartPlotProps } from '../ChartKit';

export type LineChartProps = ChartBaseProps & {
  withArea?: boolean;
};

export type LineChartPlotProps = ChartPlotProps & Pick<LineChartProps, 'withArea' | 'yDomain'>;
