'use client';

import type { LineChartProps } from './LineChart.types';

import { CHART, ChartFrame, useChartFormat } from '../ChartKit';
import { LineChartPlot } from './components';

export const LineChart = ({
  labels,
  series,
  height = CHART.defaultHeight,
  yDomain,
  withArea = false,
  ariaLabel,
  className,
  formatValue
}: LineChartProps) => {
  const format = useChartFormat(formatValue);

  return (
    <ChartFrame ariaLabel={ariaLabel} className={className} height={height}>
      {(width) => (
        <LineChartPlot formatValue={format} height={height} labels={labels} series={series} width={width} withArea={withArea} yDomain={yDomain} />
      )}
    </ChartFrame>
  );
};
