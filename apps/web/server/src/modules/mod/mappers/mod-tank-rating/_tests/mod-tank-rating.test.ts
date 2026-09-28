import type { ExpectedValues } from '@otmetki/ratings';

import { modTankRatingSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { TankRecordRow } from '../../../queries';
import type { OwnTankRow, TankRatingRow, TankTotalsRow } from '../../../selects';

import { MOD_RATINGS_READ } from '../../../config';
import { toModTankExpected, toModTankRating, toModTankRecords } from '../mod-tank-rating';

const tank: OwnTankRow = { tankId: 1, battles: 100, wins: 50, markOfMastery: 3, marksOnGun: 2, moePercent: 86.12 };
const rating: TankRatingRow = { tankId: 1, battles: 90, winRate: 48, avgDamage: 1100, wn8: 2100 };
const totals: TankTotalsRow = { tankId: 1, battles: 120, wins: 66, damageDealt: 150_000, markOfMastery: 2, marksOnGun: 1, maxFrags: 5, maxXp: 2400 };
const records: TankRecordRow = { tankId: 1, maxDamage: 6812, maxAssist: 5120, maxFrags: 6, maxXp: 2100 };
const expected: ExpectedValues = { tankId: 1, expDamage: 1180, expSpot: 1.42, expFrag: 0.98, expDef: 0.75, expWinRate: 52.3 };

const base = { tankId: 1, tank, rating, totals, records: undefined, expected: undefined };

describe('toModTankRating', () => {
  it('prefers the latest snapshot totals for battles, win rate and average damage', () => {
    const row = toModTankRating(base);

    expect(row).toMatchObject({ battles: 120, win_rate: 55, avg_damage: 1250, wn8: { value: 2100 } });
    expect(row && modTankRatingSchema.parse(row)).toEqual(row);
  });

  it('keeps marks and mastery from the own tank row over the snapshot', () => {
    expect(toModTankRating(base)).toMatchObject({ marks_on_gun: 2, mastery: 3, moe_percent: 86.12 });
  });

  it('falls back to the tank row and then the rating when there is no snapshot', () => {
    expect(toModTankRating({ ...base, totals: undefined })).toMatchObject({ battles: 100, win_rate: 50, avg_damage: 1100 });

    expect(toModTankRating({ ...base, tank: undefined, totals: undefined })).toMatchObject({
      battles: 90,
      win_rate: 48,
      marks_on_gun: null,
      mastery: 0,
      moe_percent: null
    });
  });

  it('answers nothing for a tank the account has no data for', () => {
    expect(toModTankRating({ ...base, tank: undefined, rating: undefined, totals: undefined })).toBeNull();
  });

  it('clamps out-of-range marks and mastery to the contract bounds', () => {
    const row = toModTankRating({ ...base, tank: { ...tank, marksOnGun: 7, markOfMastery: 9, moePercent: 140 } });

    expect(row).toMatchObject({ marks_on_gun: MOD_RATINGS_READ.maxMarksOnGun, mastery: MOD_RATINGS_READ.maxMastery, moe_percent: 100 });
  });

  it('has no averages for a tank with zero battles', () => {
    expect(toModTankRating({ ...base, tank: undefined, rating: undefined, totals: { ...totals, battles: 0, wins: 0 } })).toMatchObject({
      win_rate: null,
      avg_damage: null
    });
  });

  it('carries records and expected values that parse against the contract', () => {
    const row = toModTankRating({ ...base, records, expected });

    expect(row?.records).not.toBeNull();
    expect(row?.expected).not.toBeNull();
    expect(row && modTankRatingSchema.parse(row)).toEqual(row);
  });
});

describe('toModTankRecords', () => {
  it('keeps the larger of the stored battles and the dossier maxima', () => {
    expect(toModTankRecords({ totals, records })).toEqual({
      max_damage: records.maxDamage,
      max_assist: records.maxAssist,
      max_frags: Math.max(records.maxFrags ?? 0, totals.maxFrags ?? 0),
      max_xp: Math.max(records.maxXp ?? 0, totals.maxXp ?? 0)
    });
  });

  it('answers the dossier maxima alone and leaves damage and assistance unknown without stored battles', () => {
    expect(toModTankRecords({ totals, records: undefined })).toEqual({
      max_damage: null,
      max_assist: null,
      max_frags: totals.maxFrags,
      max_xp: totals.maxXp
    });
  });

  it('is null when nothing is known', () => {
    expect(toModTankRecords({ totals: { ...totals, maxFrags: null, maxXp: null }, records: undefined })).toBeNull();
    expect(toModTankRecords({ totals: undefined, records: undefined })).toBeNull();
  });

  it('keeps a zero record apart from an unknown one', () => {
    expect(toModTankRecords({ totals: undefined, records: { ...records, maxFrags: 0 } })?.max_frags).toBe(0);
  });
});

describe('toModTankExpected', () => {
  it('maps the site expected values to the contract names', () => {
    expect(toModTankExpected(expected)).toEqual({
      damage: expected.expDamage,
      spot: expected.expSpot,
      frag: expected.expFrag,
      def: expected.expDef,
      win_rate: expected.expWinRate
    });
  });

  it('is null for a tank without expected values or with values the WN8 formula cannot divide by', () => {
    expect(toModTankExpected(undefined)).toBeNull();
    expect(toModTankExpected({ ...expected, expDamage: 0 })).toBeNull();
    expect(toModTankExpected({ ...expected, expWinRate: 0 })).toBeNull();
    expect(toModTankExpected({ ...expected, expWinRate: MOD_RATINGS_READ.maxPercent + 1 })).toBeNull();
  });
});
