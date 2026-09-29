import type { ChartBaseProps, ChartPlotProps } from '../ChartKit';

export type BarChartProps = ChartBaseProps;

export type BarChartPlotProps = ChartPlotProps & Pick<BarChartProps, 'yDomain'>;
