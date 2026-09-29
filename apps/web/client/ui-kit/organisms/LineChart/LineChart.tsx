'use client';

import type { LineChartProps } from './LineChart.types';

import { ChartFrame } from '../ChartKit';
import { LineChartPlot } from './components';

export const LineChart = ({ yDomain, withArea = false, ...props }: LineChartProps) => (
  <ChartFrame {...props}>{(plot) => <LineChartPlot {...plot} withArea={withArea} yDomain={yDomain} />}</ChartFrame>
);
