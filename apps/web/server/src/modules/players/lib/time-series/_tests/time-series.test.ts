import type { ExpectedValuesTable, TankReference } from '@otmetki/ratings';

import { accountWn8 } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import type { BucketTankRow, SeriesPointsInput } from '../time-series.types';

import { seriesPoints } from '../time-series';

const DAY_ONE = new Date('2026-09-01T00:00:00.000Z');
const DAY_TWO = new Date('2026-09-02T00:00:00.000Z');

const row = (overrides: Partial<BucketTankRow>): BucketTankRow => ({
  bucket: DAY_ONE,
  tank_id: 1,
  battles: 10,
  wins: 5,
  damage: 20_000,
  frags: 8,
  spotted: 10,
  def: 2,
  cap: 1,
  ...overrides
});

const EXPECTED: ExpectedValuesTable = new Map([[1, { tankId: 1, expDamage: 1800, expSpot: 1, expFrag: 0.8, expDef: 0.5, expWinRate: 50 }]]);

const BASE: Omit<SeriesPointsInput, 'metric' | 'rows'> = {
  expected: EXPECTED,
  tiers: new Map([[1, 8]]),
  references: new Map<number, TankReference>()
};

describe('seriesPoints', () => {
  it('emits one point per bucket in chronological order', () => {
    const points = seriesPoints({ ...BASE, metric: 'battles', rows: [row({ bucket: DAY_TWO }), row({ bucket: DAY_ONE, tank_id: 2 })] });

    expect(points.map((point) => point.at)).toEqual([DAY_ONE.toISOString(), DAY_TWO.toISOString()]);
  });

  it('sums the battles of every tank in a bucket', () => {
    const points = seriesPoints({ ...BASE, metric: 'battles', rows: [row({ battles: 3 }), row({ tank_id: 2, battles: 4 })] });

    expect(points).toEqual([{ at: DAY_ONE.toISOString(), value: 7, battles: 7 }]);
  });

  it('computes the win rate and average damage across the bucket', () => {
    const rows = [row({ battles: 10, wins: 6, damage: 10_000 }), row({ tank_id: 2, battles: 30, wins: 14, damage: 50_000 })];

    expect(seriesPoints({ ...BASE, metric: 'winRate', rows })[0]?.value).toBeCloseTo(50);
    expect(seriesPoints({ ...BASE, metric: 'avgDamage', rows })[0]?.value).toBeCloseTo(1500);
  });

  it('returns null ratios for a bucket without battles', () => {
    const rows = [row({ battles: 0, wins: 0, damage: 0 })];

    expect(seriesPoints({ ...BASE, metric: 'winRate', rows })[0]?.value).toBeNull();
    expect(seriesPoints({ ...BASE, metric: 'avgDamage', rows })[0]?.value).toBeNull();
    expect(seriesPoints({ ...BASE, metric: 'eff', rows })[0]?.value).toBeNull();
  });

  it('matches the account WN8 of the tanks in the bucket', () => {
    const rows = [row({})];
    const [point] = seriesPoints({ ...BASE, metric: 'wn8', rows });
    const { wn8 } = accountWn8({
      tanks: [{ tankId: 1, battles: 10, wins: 5, damageDealt: 20_000, frags: 8, spotted: 10, capturePoints: 1, droppedCapturePoints: 2 }],
      expected: EXPECTED
    });

    expect(point?.value).toBe(wn8);
  });

  it('leaves EFF empty when no tank has a known tier', () => {
    expect(seriesPoints({ ...BASE, tiers: new Map(), metric: 'eff', rows: [row({})] })[0]?.value).toBeNull();
    expect(seriesPoints({ ...BASE, metric: 'eff', rows: [row({})] })[0]?.value).toEqual(expect.any(Number));
  });

  it('leaves the Bronya index empty without reference tables', () => {
    expect(seriesPoints({ ...BASE, metric: 'broneIndex', rows: [row({})] })[0]?.value).toBeNull();
  });

  it('returns no points for no rows', () => {
    expect(seriesPoints({ ...BASE, metric: 'battles', rows: [] })).toEqual([]);
  });
});
