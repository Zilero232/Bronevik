import { fromUnixTime } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { diffAccountTanks, hasNewBattles } from '../account-diff';

const tank = (tankId: number, battles: number, mastery = 0) => ({ tank_id: tankId, mark_of_mastery: mastery, statistics: { battles } });

describe('diffAccountTanks', () => {
  it('reports tanks whose battle count moved', () => {
    const diff = diffAccountTanks({
      baseline: [
        { tankId: 1, battles: 10, markOfMastery: 0 },
        { tankId: 2, battles: 5, markOfMastery: 0 }
      ],
      current: [tank(1, 12), tank(2, 5)]
    });

    expect(diff.changedTankIds).toEqual([1]);
    expect(diff.masteryOnlyTankIds).toEqual([]);
  });

  it('treats a tank missing from the baseline as changed', () => {
    expect(diffAccountTanks({ baseline: [], current: [tank(7, 3)] }).changedTankIds).toEqual([7]);
  });

  it('ignores a new tank that has not been played yet', () => {
    expect(diffAccountTanks({ baseline: [], current: [tank(7, 0)] }).changedTankIds).toEqual([]);
  });

  it('separates a mastery change without new battles', () => {
    const diff = diffAccountTanks({ baseline: [{ tankId: 3, battles: 4, markOfMastery: 1 }], current: [tank(3, 4, 2)] });

    expect(diff.changedTankIds).toEqual([]);
    expect(diff.masteryOnlyTankIds).toEqual([3]);
  });
});

describe('hasNewBattles', () => {
  const stored = fromUnixTime(1_700_000_000);

  it('is true when last_battle_time moved past the stored value', () => {
    expect(hasNewBattles({ storedLastBattleAt: stored, lastBattleTime: 1_700_000_100, neverScanned: false })).toBe(true);
  });

  it('is false when last_battle_time did not move', () => {
    expect(hasNewBattles({ storedLastBattleAt: stored, lastBattleTime: 1_700_000_000, neverScanned: false })).toBe(false);
  });

  it('always scans an account that was never scanned', () => {
    expect(hasNewBattles({ storedLastBattleAt: stored, lastBattleTime: 1_600_000_000, neverScanned: true })).toBe(true);
  });
});
