import type { MoeThreshold } from '@bronevik/schemas';

import { addDays, formatISO, parseISO } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { MOE_KEYS } from '../../../config';
import { moeDelta, moeSeries } from '../moe-deltas';

const START = parseISO('2026-07-01');

const STEP = 10;

const point = (day: number, p100Gap: number | null = 400): MoeThreshold => {
  const p95 = 3_000 + day * STEP;

  return {
    tankId: 1,
    date: formatISO(addDays(START, day), { representation: 'date' }),
    source: 'manual',
    p65: p95 - 900,
    p85: p95 - 400,
    p95,
    p100: p100Gap === null ? null : p95 + p100Gap
  };
};

const HISTORY = Array.from({ length: 40 }, (_, day) => point(day));

describe('moeDelta', () => {
  it('measures the change against the point the given number of days back', () => {
    expect(moeDelta({ history: HISTORY, key: 'p95', days: 7 })).toBe(7 * STEP);
  });

  it('grows with a longer window on a rising threshold', () => {
    const week = moeDelta({ history: HISTORY, key: 'p95', days: 7 }) ?? 0;
    const month = moeDelta({ history: HISTORY, key: 'p95', days: 30 }) ?? 0;

    expect(month).toBeGreaterThan(week);
  });

  it('returns null when the history is shorter than the window', () => {
    expect(moeDelta({ history: HISTORY.slice(-5), key: 'p95', days: 7 })).toBeNull();
  });

  it('returns null for an empty history or a missing 100% threshold', () => {
    expect(moeDelta({ history: [], key: 'p95', days: 7 })).toBeNull();
    expect(moeDelta({ history: [point(0, null), point(10, null)], key: 'p100', days: 7 })).toBeNull();
  });
});

describe('moeSeries', () => {
  it('draws one line per threshold with a value for every date', () => {
    const { labels, series } = moeSeries(HISTORY);

    expect(series.map(({ key }) => key)).toEqual([...MOE_KEYS]);
    expect(series.every(({ values }) => values.length === labels.length)).toBe(true);
  });

  it('drops the 100% line when the history has gaps in it', () => {
    const { series } = moeSeries([point(0), point(1, null)]);

    expect(series.map(({ key }) => key)).not.toContain('p100');
  });
});
