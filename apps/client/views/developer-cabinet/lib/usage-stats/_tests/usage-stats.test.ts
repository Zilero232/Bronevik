import type { ApiUsagePoint } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { quotaShare, quotaTone, usageSeries, usageTotals } from '../usage-stats';
import { USAGE_STATS } from '../usage-stats.constants';

const point = (day: string, requests: number, errors: number): ApiUsagePoint => ({
  day,
  requests,
  errors,
  throttled: errors > 0 ? 1 : 0,
  avgLatencyMs: null
});

const HISTORY = [point('2026-09-23', 120, 6), point('2026-09-24', 80, 0), point('2026-09-25', 0, 0)];

describe('usageSeries', () => {
  it('keeps every series aligned with its day', () => {
    const series = usageSeries(HISTORY);

    expect(series.days).toHaveLength(HISTORY.length);
    expect(series.requests).toHaveLength(HISTORY.length);
    expect(series.errors[0]).toBe(HISTORY[0]?.errors);
    expect(series.days.at(-1)).toBe(HISTORY.at(-1)?.day);
  });
});

describe('usageTotals', () => {
  it('sums the period and derives the error rate from the sums', () => {
    const totals = usageTotals(HISTORY);

    expect(totals.requests).toBe(200);
    expect(totals.errorRate).toBeCloseTo(totals.errors / totals.requests);
  });

  it('reports a zero error rate for a silent period instead of NaN', () => {
    expect(usageTotals([]).errorRate).toBe(0);
  });
});

describe('quotaShare', () => {
  it('stays inside 0–1 even past the limit', () => {
    expect(quotaShare({ used: 50, limit: 100 })).toBe(0.5);
    expect(quotaShare({ used: 150, limit: 100 })).toBe(1);
  });

  it('treats a missing limit as an empty gauge', () => {
    expect(quotaShare({ used: 5, limit: 0 })).toBe(0);
  });
});

describe('quotaTone', () => {
  it('escalates as the day’s quota runs out', () => {
    expect(quotaTone(0)).toBe('accent');
    expect(quotaTone(USAGE_STATS.warnShare)).toBe('average');
    expect(quotaTone(USAGE_STATS.dangerShare)).toBe('bad');
    expect(quotaTone(1)).toBe('bad');
  });
});
