import type { ReactNode } from 'react';

import type { BarChartProps } from '@/ui-kit';

export type RngHistogramProps = Pick<BarChartProps, 'formatValue' | 'labels' | 'series'> & {
  title: string;
  meta?: ReactNode;
};
