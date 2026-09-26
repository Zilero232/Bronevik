import type { MoeThreshold } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { historySeries } from '../moe-history';

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
