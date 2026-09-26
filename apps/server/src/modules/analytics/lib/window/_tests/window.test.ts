import { ANALYTICS_PERIODS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { periodStart, trendGranularity } from '../window';

const NOW = new Date('2026-09-26T12:00:00Z');

describe('periodStart', () => {
  it('has no lower bound for the whole history', () => {
    expect(periodStart({ period: 'all', now: NOW })).toBeNull();
  });

  it('moves further back for every longer period', () => {
    const starts = ANALYTICS_PERIODS.filter((period) => period !== 'all').map((period) => periodStart({ period, now: NOW })?.getTime() ?? 0);

    expect(starts).toEqual([...starts].sort((a, b) => b - a));
  });
});

describe('trendGranularity', () => {
  it('uses weeks for short periods and months for the long ones', () => {
    expect(trendGranularity('d30')).toBe('week');
    expect(trendGranularity('all')).toBe('month');
  });
});
