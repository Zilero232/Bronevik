import { modTankRatingSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { OwnTankRow, TankRatingRow, TankTotalsRow } from '../../../selects';

import { MOD_RATINGS_READ } from '../../../config';
import { toModTankRating } from '../mod-tank-rating';

const tank: OwnTankRow = { tankId: 1, battles: 100, wins: 50, markOfMastery: 3, marksOnGun: 2, moePercent: 86.12 };
const rating: TankRatingRow = { tankId: 1, battles: 90, winRate: 48, avgDamage: 1100, wn8: 2100 };
const totals: TankTotalsRow = { tankId: 1, battles: 120, wins: 66, damageDealt: 150_000, markOfMastery: 2, marksOnGun: 1 };

describe('toModTankRating', () => {
  it('prefers the latest snapshot totals for battles, win rate and average damage', () => {
    const row = toModTankRating({ tankId: 1, tank, rating, totals });

    expect(row).toMatchObject({ battles: 120, win_rate: 55, avg_damage: 1250, wn8: { value: 2100 } });
    expect(row && modTankRatingSchema.parse(row)).toEqual(row);
  });

  it('keeps marks and mastery from the own tank row over the snapshot', () => {
    expect(toModTankRating({ tankId: 1, tank, rating, totals })).toMatchObject({ marks_on_gun: 2, mastery: 3, moe_percent: 86.12 });
  });

  it('falls back to the tank row and then the rating when there is no snapshot', () => {
    expect(toModTankRating({ tankId: 1, tank, rating, totals: undefined })).toMatchObject({ battles: 100, win_rate: 50, avg_damage: 1100 });

    expect(toModTankRating({ tankId: 1, tank: undefined, rating, totals: undefined })).toMatchObject({
      battles: 90,
      win_rate: 48,
      marks_on_gun: null,
      mastery: 0,
      moe_percent: null
    });
  });

  it('answers nothing for a tank the account has no data for', () => {
    expect(toModTankRating({ tankId: 1, tank: undefined, rating: undefined, totals: undefined })).toBeNull();
  });

  it('clamps out-of-range marks and mastery to the contract bounds', () => {
    const row = toModTankRating({ tankId: 1, tank: { ...tank, marksOnGun: 7, markOfMastery: 9, moePercent: 140 }, rating, totals });

    expect(row).toMatchObject({ marks_on_gun: MOD_RATINGS_READ.maxMarksOnGun, mastery: MOD_RATINGS_READ.maxMastery, moe_percent: 100 });
  });

  it('has no averages for a tank with zero battles', () => {
    expect(toModTankRating({ tankId: 1, tank: undefined, rating: undefined, totals: { ...totals, battles: 0, wins: 0 } })).toMatchObject({
      win_rate: null,
      avg_damage: null
    });
  });
});
