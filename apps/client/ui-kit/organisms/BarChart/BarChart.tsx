'use client';

import { CHART, useChartFormat } from '@/shared/lib';

import type { BarChartProps } from './BarChart.types';

import { ChartFrame } from '../ChartKit';
import { BarChartPlot } from './components';

export const BarChart = ({ labels, series, height = CHART.defaultHeight, yDomain, ariaLabel, className, formatValue }: BarChartProps) => {
  const format = useChartFormat(formatValue);

  return (
    <ChartFrame ariaLabel={ariaLabel} className={className} height={height}>
      {(width) => <BarChartPlot formatValue={format} height={height} labels={labels} series={series} width={width} yDomain={yDomain} />}
    </ChartFrame>
  );
};
