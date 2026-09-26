import { describe, expect, it } from 'vitest';

import { replayMedals } from '../replay-medals';

describe('replayMedals', () => {
  it('puts the mastery badge first and keeps battle medals once', () => {
    expect(replayMedals({ markOfMastery: 4, battleAchievements: ['markOfMastery', 'warrior', 'warrior'] })).toEqual(['markOfMastery', 'warrior']);
  });

  it('maps lower mastery classes to their badges', () => {
    expect(replayMedals({ markOfMastery: 1, battleAchievements: [] })).toEqual(['markOfMasteryIII']);
  });

  it('returns nothing without data', () => {
    expect(replayMedals({ markOfMastery: 0, battleAchievements: [] })).toEqual([]);
    expect(replayMedals({ markOfMastery: undefined, battleAchievements: [] })).toEqual([]);
  });
});
