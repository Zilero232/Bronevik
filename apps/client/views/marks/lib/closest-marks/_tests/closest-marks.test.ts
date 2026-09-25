import type { PlayerMarkRow } from '@bronevik/schemas';

import { MOE } from '@bronevik/ratings';
import { describe, expect, it } from 'vitest';

import { closestMarks, markCountAt, markProgress } from '../closest-marks';

const [ONE, TWO, THREE] = MOE.markPercents;

const row = (slug: string, moePercent: number | null, damageToNextMark: number | null): PlayerMarkRow => ({
  vehicle: {
    tankId: slug.length,
    name: slug,
    shortName: slug,
    slug,
    nation: 'ussr',
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  battles: 100,
  marksOnGun: 1,
  markOfMastery: 0,
  moePercent,
  movingDamage: null,
  avgCombinedDamage: null,
  combinedDamageSource: null,
  thresholds: null,
  nextMarkPercent: moePercent === null ? null : TWO,
  damageToNextMark,
  updatedAt: null
});

describe('markProgress', () => {
  it('measures progress from the previous mark, not from zero', () => {
    expect(markProgress({ percent: ONE, nextMark: TWO })).toBe(0);
    expect(markProgress({ percent: (TWO + THREE) / 2, nextMark: THREE })).toBeCloseTo(0.5);
  });

  it('counts the first mark from zero percent', () => {
    expect(markProgress({ percent: ONE / 2, nextMark: ONE })).toBeCloseTo(0.5);
  });

  it('never leaves the zero to one range', () => {
    expect(markProgress({ percent: THREE + 1, nextMark: THREE })).toBe(1);
  });
});

describe('closestMarks', () => {
  it('puts the tank with the least damage left first', () => {
    const result = closestMarks([row('far', 70, 900), row('near', 80, 120), row('mid', 75, 400)]);

    expect(result.map(({ vehicle }) => vehicle.slug)).toEqual(['near', 'mid', 'far']);
  });

  it('skips tanks without a known next mark', () => {
    expect(closestMarks([row('unknown', null, null), row('done', 99, null)])).toEqual([]);
  });
});

describe('markCountAt', () => {
  it('names the mark a threshold percent awards', () => {
    expect(MOE.markPercents.map(markCountAt)).toEqual([1, 2, 3]);
  });
});
