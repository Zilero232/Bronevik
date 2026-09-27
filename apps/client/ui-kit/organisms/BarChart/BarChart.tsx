'use client';

import { CHART, useChartFormat } from '@/shared/lib';

import type { BarChartProps } from './BarChart.types';

import { ChartFrame } from '../ChartKit';
import { BarChartPlot } from './components';

export const BarChart = ({
  labels,
  series,
  height = CHART.defaultHeight,
  yDomain,
  ariaLabel,
  className,
  hasTableToggle,
  formatValue
}: BarChartProps) => {
  const format = useChartFormat(formatValue);

  return (
    <ChartFrame
      ariaLabel={ariaLabel}
      className={className}
      formatValue={format}
      hasTableToggle={hasTableToggle}
      height={height}
      labels={labels}
      series={series}
    >
      {(width) => <BarChartPlot formatValue={format} height={height} labels={labels} series={series} width={width} yDomain={yDomain} />}
    </ChartFrame>
  );
};
