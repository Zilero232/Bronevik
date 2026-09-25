import { fromUnixTime } from 'date-fns';

import type { AccountTanksDiff, DiffAccountTanksInput, HasNewBattlesInput } from './account-diff.types';

export const hasNewBattles = ({ storedLastBattleAt, lastBattleTime, neverScanned }: HasNewBattlesInput): boolean => {
  if (neverScanned) {
    return true;
  }

  if (!storedLastBattleAt) {
    return lastBattleTime > 0;
  }

  return fromUnixTime(lastBattleTime).getTime() > storedLastBattleAt.getTime();
};

export const diffAccountTanks = ({ baseline, current }: DiffAccountTanksInput): AccountTanksDiff => {
  const known = new Map(baseline.map((tank) => [tank.tankId, tank]));
  const changedTankIds: number[] = [];
  const masteryOnlyTankIds: number[] = [];

  for (const tank of current) {
    const before = known.get(tank.tank_id);

    if (!before || before.battles !== tank.statistics.battles) {
      if (tank.statistics.battles > 0) {
        changedTankIds.push(tank.tank_id);
      }

      continue;
    }

    if (before.markOfMastery !== tank.mark_of_mastery) {
      masteryOnlyTankIds.push(tank.tank_id);
    }
  }

  return { changedTankIds, masteryOnlyTankIds };
};
