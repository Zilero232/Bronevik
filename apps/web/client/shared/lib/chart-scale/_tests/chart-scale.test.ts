import { describe, expect, it } from 'vitest';

import { bandLayout, chartInner, clampIndex, linearLayout, tickIndices } from '../chart-scale';
import { CHART } from '../chart-scale.constants';

const SERIES = [{ id: 'a', label: 'A', values: [10, 40, 25] }];
const LABELS = ['1', '2', '3'];

describe('chartInner', () => {
  it('subtracts the margins and never goes negative', () => {
    const { innerWidth, innerHeight } = chartInner({ width: 400, height: 200 });

    expect(innerWidth).toBe(400 - CHART.margin.left - CHART.margin.right);
    expect(innerHeight).toBe(200 - CHART.margin.top - CHART.margin.bottom);
    expect(chartInner({ width: 10, height: 10 })).toEqual({ innerWidth: 0, innerHeight: 0 });
  });
});

describe('tickIndices', () => {
  it('never shows more ticks than the chart allows', () => {
    [1, 7, 8, 30, 365].forEach((count) => expect(tickIndices(count).length).toBeLessThanOrEqual(CHART.maxXTicks));
  });

  it('always starts at the first label', () => {
    expect(tickIndices(30)[0]).toBe(0);
  });
});

describe('clampIndex', () => {
  it('rounds to the nearest index inside the range', () => {
    expect(clampIndex({ value: 1.4, count: 3 })).toBe(1);
    expect(clampIndex({ value: -2, count: 3 })).toBe(0);
    expect(clampIndex({ value: 99, count: 3 })).toBe(2);
  });
});

describe('linearLayout', () => {
  it('fits every value inside the plot', () => {
    const { yScale, innerHeight } = linearLayout({ width: 400, height: 200, labels: LABELS, series: SERIES });

    SERIES[0].values.forEach((value) => {
      expect(yScale(value)).toBeGreaterThanOrEqual(0);
      expect(yScale(value)).toBeLessThanOrEqual(innerHeight);
    });
  });

  it('honours an explicit domain', () => {
    const { yScale } = linearLayout({ width: 400, height: 200, labels: LABELS, series: SERIES, yDomain: [0, 100] });

    expect(yScale.domain()).toEqual([0, 100]);
  });
});

describe('bandLayout', () => {
  it('gives every label a band and starts bars from zero', () => {
    const { xScale, yScale } = bandLayout({ width: 400, height: 200, labels: LABELS, series: SERIES });

    expect(xScale.domain()).toEqual(LABELS);
    expect(yScale.domain()[0]).toBeLessThanOrEqual(0);
  });
});
