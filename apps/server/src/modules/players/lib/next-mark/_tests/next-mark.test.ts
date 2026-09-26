import { MOE } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { combinedSource, nextMark } from '../next-mark';

const [firstMark = 0, secondMark = 0] = MOE.markPercents;
const thresholds = { p65: 2_000, p85: 2_600, p95: 3_100, p100: null };

describe('nextMark', () => {
  it('targets the first mark for a player below it', () => {
    expect(nextMark({ percent: firstMark - 1, marksOnGun: null, thresholds: null, movingDamage: null })).toEqual({
      percent: firstMark,
      damage: null
    });
  });

  it('counts a percent exactly on a mark as reached', () => {
    expect(nextMark({ percent: firstMark, marksOnGun: null, thresholds: null, movingDamage: null }).percent).toBe(secondMark);
  });

  it('falls back to the marks on the gun when the percent is unknown', () => {
    expect(nextMark({ percent: null, marksOnGun: 1, thresholds: null, movingDamage: null }).percent).toBe(secondMark);
  });

  it('has no next mark once every mark is reached', () => {
    expect(nextMark({ percent: 100, marksOnGun: null, thresholds, movingDamage: 0 })).toEqual({ percent: null, damage: null });
  });

  it('reports the missing damage and never a negative one', () => {
    expect(nextMark({ percent: 0, marksOnGun: null, thresholds, movingDamage: thresholds.p65 - 100 }).damage).toBe(100);
    expect(nextMark({ percent: 0, marksOnGun: null, thresholds, movingDamage: thresholds.p65 + 100 }).damage).toBe(0);
  });
});

describe('combinedSource', () => {
  it('prefers battles when the battles value exists', () => {
    expect(combinedSource({ fromBattles: 0, fromRating: 10 })).toBe('battles');
  });

  it('falls back to the rating damage', () => {
    expect(combinedSource({ fromBattles: undefined, fromRating: 0 })).toBe('damage');
  });

  it('returns null when neither source has a value', () => {
    expect(combinedSource({ fromBattles: undefined, fromRating: undefined })).toBeNull();
  });
});
