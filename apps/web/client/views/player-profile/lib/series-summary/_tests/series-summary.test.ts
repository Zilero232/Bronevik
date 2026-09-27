import { describe, expect, it } from 'vitest';

import { seriesSummary } from '../series-summary';

describe('seriesSummary', () => {
  it('returns nothing for an empty series', () => {
    expect(seriesSummary([])).toBeNull();
  });

  it('measures the change from the first point to the last', () => {
    expect(seriesSummary([1_000, 1_400, 1_200])?.change).toBe(200);
  });

  it('keeps the average between the extremes', () => {
    const summary = seriesSummary([3, 9, 6, 1]);

    expect(summary?.average).toBeGreaterThanOrEqual(summary?.min ?? Number.NaN);
    expect(summary?.average).toBeLessThanOrEqual(summary?.max ?? Number.NaN);
  });

  it('treats a single point as no change', () => {
    expect(seriesSummary([42])).toEqual({ last: 42, min: 42, max: 42, average: 42, change: 0 });
  });
});
