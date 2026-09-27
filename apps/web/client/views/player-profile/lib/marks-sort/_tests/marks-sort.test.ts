import { describe, expect, it } from 'vitest';

import type { PlayerMarkRow } from '@/entities/player/profile';

import { sortMarks } from '../marks-sort';

const row = ({ tankId, ...overrides }: Partial<PlayerMarkRow> & { tankId: number }): PlayerMarkRow => ({
  vehicle: {
    tankId,
    name: `Tank ${tankId}`,
    shortName: `T${tankId}`,
    slug: `tank-${tankId}`,
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  battles: 100,
  marksOnGun: null,
  markOfMastery: 0,
  moePercent: 50,
  movingDamage: null,
  avgCombinedDamage: null,
  combinedDamageSource: null,
  thresholds: null,
  nextMarkPercent: null,
  damageToNextMark: 500,
  updatedAt: null,
  ...overrides
});

const ROWS = [
  row({ tankId: 1, moePercent: 90, damageToNextMark: 200, battles: 50 }),
  row({ tankId: 2, moePercent: 70, damageToNextMark: 50, battles: 900 }),
  row({ tankId: 3, moePercent: null, damageToNextMark: null }),
  row({ tankId: 4, moePercent: 100, damageToNextMark: null, battles: 300 })
];

const ids = (rows: PlayerMarkRow[]) => rows.map(({ vehicle }) => vehicle.tankId);

describe('sortMarks', () => {
  it('drops tanks that have no mark progress to show', () => {
    expect(ids(sortMarks({ rows: ROWS, sort: 'percent' }))).not.toContain(3);
  });

  it('puts the smallest damage gap first when looking for the closest mark', () => {
    expect(ids(sortMarks({ rows: ROWS, sort: 'closest' }))[0]).toBe(2);
  });

  it('pushes finished tanks to the end of the closest list', () => {
    expect(ids(sortMarks({ rows: ROWS, sort: 'closest' })).at(-1)).toBe(4);
  });

  it('orders by percent from the top', () => {
    expect(ids(sortMarks({ rows: ROWS, sort: 'percent' }))).toEqual([4, 1, 2]);
  });

  it('orders by battles from the most played', () => {
    expect(ids(sortMarks({ rows: ROWS, sort: 'battles' }))).toEqual([2, 4, 1]);
  });
});
