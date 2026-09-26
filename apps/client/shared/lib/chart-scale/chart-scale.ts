import { scaleBand, scaleLinear } from '@visx/scale';
import { clamp, range } from 'remeda';

import type { ChartLayoutInput, ClampIndexInput } from './chart-scale.types';

import { CHART } from './chart-scale.constants';

const extent = ({ series, includeZero }: Pick<ChartLayoutInput, 'includeZero' | 'series'>): [number, number] => {
  const values = series.flatMap((item) => item.values);
  const min = Math.min(...values, includeZero ? 0 : Infinity);
  const max = Math.max(...values);
  const pad = (max - min || Math.abs(max) || 1) * CHART.domainPadding;

  return [includeZero ? min : min - pad, max + pad];
};

export const chartInner = ({ width, height }: Pick<ChartLayoutInput, 'height' | 'width'>) => ({
  innerWidth: Math.max(width - CHART.margin.left - CHART.margin.right, 0),
  innerHeight: Math.max(height - CHART.margin.top - CHART.margin.bottom, 0)
});

export const linearLayout = ({ width, height, labels, series, yDomain, includeZero = false }: ChartLayoutInput) => {
  const { innerWidth, innerHeight } = chartInner({ width, height });

  return {
    innerWidth,
    innerHeight,
    xScale: scaleLinear<number>({ domain: [0, Math.max(labels.length - 1, 1)], range: [0, innerWidth] }),
    yScale: scaleLinear<number>({ domain: yDomain ?? extent({ series, includeZero }), range: [innerHeight, 0], nice: true })
  };
};

export const bandLayout = ({ width, height, labels, series, yDomain }: ChartLayoutInput) => {
  const { innerWidth, innerHeight } = chartInner({ width, height });

  return {
    innerWidth,
    innerHeight,
    xScale: scaleBand<string>({ domain: labels, range: [0, innerWidth], padding: CHART.bandPadding }),
    yScale: scaleLinear<number>({ domain: yDomain ?? extent({ series, includeZero: true }), range: [innerHeight, 0], nice: true })
  };
};

export const tickIndices = (count: number) => {
  const step = Math.max(Math.ceil(count / CHART.maxXTicks), 1);

  return range(0, count).filter((index) => index % step === 0);
};

export const clampIndex = ({ value, count }: ClampIndexInput) => clamp(Math.round(value), { min: 0, max: count - 1 });
