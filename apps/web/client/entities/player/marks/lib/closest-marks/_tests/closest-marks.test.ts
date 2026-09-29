import type { PlayerMarkRow } from '@otmetki/schemas';

import { MOE } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { closestMarks } from '../closest-marks';

const [, TWO] = MOE.markPercents;

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
    status: 'researchable',
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

describe('closestMarks', () => {
  it('puts the tank with the least damage left first', () => {
    const result = closestMarks({ items: [row('far', 70, 900), row('near', 80, 120), row('mid', 75, 400)] });

    expect(result.map(({ vehicle }) => vehicle.slug)).toEqual(['near', 'mid', 'far']);
  });

  it('skips tanks without a known next mark or already past it', () => {
    expect(closestMarks({ items: [row('unknown', null, null), row('done', 99, null), row('past', 90, 10)] })).toEqual([]);
  });

  it('keeps only the requested number of tanks', () => {
    const result = closestMarks({ items: [row('far', 70, 900), row('near', 80, 120), row('mid', 75, 400)], limit: 2 });

    expect(result.map(({ vehicle }) => vehicle.slug)).toEqual(['near', 'mid']);
  });

  it('reports the current percent and the damage left', () => {
    expect(closestMarks({ items: [row('near', 80, 120)] })[0]).toMatchObject({ percent: 80, damageToNext: 120 });
  });
});
