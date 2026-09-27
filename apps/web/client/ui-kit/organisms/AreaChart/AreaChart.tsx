'use client';

import type { AreaChartProps } from './AreaChart.types';

import { LineChart } from '../LineChart';

export const AreaChart = (props: AreaChartProps) => <LineChart {...props} withArea />;
