'use client';

import type { UseLineChartLayoutInput } from './use-line-chart-layout.types';

import { clampIndex, linearLayout } from '../chart-scale';
import { useChartHover } from '../use-chart-hover';

export const useLineChartLayout = ({ width, height, labels, series, yDomain }: UseLineChartLayoutInput) => {
  const layout = linearLayout({ width, height, labels, series, yDomain });
  const { xScale, yScale } = layout;
  const pointer = useChartHover({
    count: labels.length,
    toIndex: (x) => clampIndex({ value: xScale.invert(x), count: labels.length }),
    toPosition: (index) => ({ left: xScale(index), top: yScale(series[0]?.values[index] ?? 0) })
  });

  return { layout, pointer };
};
