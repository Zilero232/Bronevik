import type { TimeSeries } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { recentSeries } from '../recent-series';

const series = (values: (number | null)[]): TimeSeries => ({
  metric: 'wn8',
  granularity: 'day',
  points: values.map((value, index) => ({ at: `2026-09-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`, value })),
  markers: []
});

describe('recentSeries', () => {
  it('keeps the last non-null values', () => {
    expect(recentSeries({ series: series([1, null, 2, 3, 4]), count: 3 })).toEqual([2, 3, 4]);
  });

  it('is empty without a series', () => {
    expect(recentSeries({ count: 30 })).toEqual([]);
  });
});
