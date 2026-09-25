import type { MoeThreshold } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { historySeries, sparkDirection, sparkPoints } from '../moe-history';

const point = (index: number, p100: number | null = 4_000): MoeThreshold => ({
  tankId: 1,
  date: `2026-09-${String(index + 1).padStart(2, '0')}`,
  source: 'bronevik',
  p65: 2_000 + index,
  p85: 2_600 + index,
  p95: 3_000 + index,
  p100
});

const HISTORY = Array.from({ length: 10 }, (_, index) => point(index));

describe('historySeries', () => {
  it('keeps one value per date for every mark threshold', () => {
    const series = historySeries(HISTORY);

    expect(series.dates).toHaveLength(HISTORY.length);
    expect(series.p95).toEqual(HISTORY.map(({ p95 }) => p95));
  });

  it('drops the hundred percent series points that are unknown', () => {
    expect(historySeries([point(0), point(1, null)]).p100).toHaveLength(1);
  });
});

describe('sparkPoints', () => {
  it('takes the newest 95 percent values in chronological order', () => {
    const points = sparkPoints({ history: HISTORY, count: 3 });

    expect(points).toEqual(HISTORY.slice(-3).map(({ p95 }) => p95));
  });
});

describe('sparkDirection', () => {
  it('follows the sign of the change from the first to the last point', () => {
    expect(sparkDirection([1, 5])).toBe('up');
    expect(sparkDirection([5, 1])).toBe('down');
    expect(sparkDirection([3, 3])).toBe('flat');
  });

  it('has no direction without points', () => {
    expect(sparkDirection([])).toBe('flat');
  });
});
