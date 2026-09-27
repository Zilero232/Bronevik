'use client';

import { scaleBand } from '@visx/scale';

import type { UseBarChartLayoutInput } from './use-bar-chart-layout.types';

import { bandLayout, clampIndex } from '../chart-scale';
import { useChartHover } from '../use-chart-hover';

export const useBarChartLayout = ({ width, height, labels, series, yDomain }: UseBarChartLayoutInput) => {
  const layout = bandLayout({ width, height, labels, series, yDomain });
  const { xScale, yScale } = layout;
  const pointer = useChartHover({
    count: labels.length,
    toIndex: (x) => clampIndex({ value: (x - xScale.step() * xScale.paddingOuter()) / xScale.step() - 0.5, count: labels.length }),
    toPosition: (index) => ({
      left: (xScale(labels[index]) ?? 0) + xScale.bandwidth() / 2,
      top: yScale(Math.max(...series.map((item) => item.values[index] ?? 0)))
    })
  });

  const inner = scaleBand<string>({ domain: series.map((item) => item.id), range: [0, xScale.bandwidth()], padding: 0.12 });

  return { layout, pointer, inner };
};
