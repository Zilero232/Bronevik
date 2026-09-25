import { describe, expect, it } from 'vitest';

import { diffTankTotals, diffTotals, PERIOD_WINDOWS, periodRatings, pickSnapshotPair, RECENT_PERIODS } from '..';
import { makeTank, UNIT_EXPECTED } from '../../_tests/fixtures';
import { tankWn8 } from '../../wn8';

const NOW = new Date('2026-09-24T12:00:00Z');

const daysAgo = (days: number) => new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);

describe('diffTotals', () => {
  it('subtracts cumulative totals including optional fields present on both sides', () => {
    const delta = diffTotals({ from: makeTank({ tankId: 1, battles: 100 }), to: makeTank({ tankId: 1, battles: 150 }) });
    const { tankId: _tankId, ...expected } = makeTank({ tankId: 1, battles: 50 });

    expect(delta).toEqual(expected);
  });

  it('refuses a pair where battles went backwards', () => {
    expect(diffTotals({ from: makeTank({ tankId: 1, battles: 10 }), to: makeTank({ tankId: 1, battles: 5 }) })).toBeNull();
  });
});

describe('diffTankTotals', () => {
  it('keeps only tanks played in the period and treats new tanks as starting from zero', () => {
    const from = [makeTank({ tankId: 1, battles: 100 }), makeTank({ tankId: 2, battles: 50 })];
    const to = [makeTank({ tankId: 1, battles: 120 }), makeTank({ tankId: 2, battles: 50 }), makeTank({ tankId: 3, battles: 7 })];

    const changed = diffTankTotals({ from, to });

    expect(changed.map(({ tankId, battles }) => [tankId, battles])).toEqual([
      [1, 20],
      [3, 7]
    ]);
  });
});

describe('periodRatings', () => {
  it('rates only the battles inside the period', () => {
    const from = [makeTank({ tankId: 1, battles: 1000 })];
    const to = [{ ...makeTank({ tankId: 1, battles: 1100 }), damageDealt: 1000 * 1000 + 100 * 2000 }];
    const onlyPeriod = { ...makeTank({ tankId: 1, battles: 100 }), damageDealt: 100 * 2000 };

    const period = periodRatings({ from, to, expected: new Map([[1, UNIT_EXPECTED]]), tiers: new Map([[1, 10]]) });

    expect(period.totals.battles).toBe(100);
    expect(period.averages.damage).toBe(2000);
    expect(period.averageTier).toBe(10);
    expect(period.wn8).toBeCloseTo(tankWn8({ totals: onlyPeriod, expected: UNIT_EXPECTED }) ?? Number.NaN, 8);
    expect(period.eff).not.toBeNull();
  });
});

describe('pickSnapshotPair', () => {
  const snapshots = [
    { takenAt: daysAgo(40), battles: 1000 },
    { takenAt: daysAgo(10), battles: 1200 },
    { takenAt: daysAgo(3), battles: 1300 },
    { takenAt: daysAgo(0.5), battles: 1350 }
  ];

  it('picks the newest snapshot at or before the window start', () => {
    const pair = pickSnapshotPair({ snapshots, window: PERIOD_WINDOWS['7d'], now: NOW });

    expect(pair?.from).toBe(snapshots[1]);
    expect(pair?.to).toBe(snapshots[3]);
    expect(pair?.isPartial).toBe(false);
  });

  it('falls back to the earliest snapshot and flags a partial window', () => {
    const pair = pickSnapshotPair({ snapshots, window: PERIOD_WINDOWS['60d'], now: NOW });

    expect(pair?.from).toBe(snapshots[0]);
    expect(pair?.isPartial).toBe(true);
  });

  it('picks by battle count for last-N windows', () => {
    expect(pickSnapshotPair({ snapshots, window: { kind: 'battles', count: 100 }, now: NOW })?.from).toBe(snapshots[1]);
    expect(pickSnapshotPair({ snapshots, window: { kind: 'battles', count: 50 }, now: NOW })?.from).toBe(snapshots[2]);
  });

  it('accepts unsorted input', () => {
    expect(pickSnapshotPair({ snapshots: [...snapshots].reverse(), window: PERIOD_WINDOWS['7d'], now: NOW })?.from).toBe(snapshots[1]);
  });

  it('returns null when nothing happened inside the window', () => {
    const idle = [{ takenAt: daysAgo(5), battles: 10 }];

    expect(pickSnapshotPair({ snapshots: idle, window: PERIOD_WINDOWS['24h'], now: NOW })).toBeNull();
    expect(pickSnapshotPair({ snapshots: [], window: PERIOD_WINDOWS['24h'], now: NOW })).toBeNull();
    expect(pickSnapshotPair({ snapshots: [...idle, { takenAt: daysAgo(4), battles: 12 }], window: PERIOD_WINDOWS['24h'], now: NOW })).toBeNull();
  });
});

describe('PERIOD_WINDOWS', () => {
  it('has exactly one window per public recent period', () => {
    expect(Object.keys(PERIOD_WINDOWS).sort()).toEqual([...RECENT_PERIODS].sort());
  });

  it('orders duration windows from the shortest to the longest', () => {
    const days = RECENT_PERIODS.map((period) => PERIOD_WINDOWS[period]).flatMap((window) => (window.kind === 'duration' ? [window.days] : []));

    expect(days).toEqual([...days].sort((left, right) => left - right));
  });
});
