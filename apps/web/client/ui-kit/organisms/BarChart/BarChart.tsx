'use client';

import type { BarChartProps } from './BarChart.types';

import { ChartFrame } from '../ChartKit';
import { BarChartPlot } from './components';

export const BarChart = ({ yDomain, ...props }: BarChartProps) => (
  <ChartFrame {...props}>{(plot) => <BarChartPlot {...plot} yDomain={yDomain} />}</ChartFrame>
);
