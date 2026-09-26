import { clamp, sortBy, sum } from 'remeda';

import type { FrontlinePlan, FrontlinePlanInput, XpToLevelInput } from './frontline.types';

import { FRONTLINE_GAME, FRONTLINE_RESERVES } from '../../config';
import { battlesFor } from '../research-plan';

const LEVEL_XP: readonly number[] = FRONTLINE_GAME.xpToNextLevel;

const levelCost = (level: number): number => LEVEL_XP[level - 1] ?? 0;

export const xpToLevel = ({ level, levelXp, target }: XpToLevelInput): number => {
  const from = clamp(Math.floor(level), { min: 1, max: FRONTLINE_GAME.maxLevel });
  const to = clamp(Math.floor(target), { min: 1, max: FRONTLINE_GAME.maxLevel });

  if (to <= from) {
    return 0;
  }

  return Math.max(0, sum(LEVEL_XP.slice(from - 1, to - 1)) - levelXp);
};

export const frontlinePlan = ({ level, levelXp, battleXp, prestige, targetPrestige, battlesPerDay }: FrontlinePlanInput): FrontlinePlan => {
  const current = clamp(Math.floor(level), { min: 1, max: FRONTLINE_GAME.maxLevel });
  const isMaxLevel = current === FRONTLINE_GAME.maxLevel;
  const earned = isMaxLevel ? 0 : clamp(levelXp, { min: 0, max: Math.max(0, levelCost(current) - 1) });
  const xpPerCycle = sum(LEVEL_XP);
  const xpToNext = isMaxLevel ? 0 : levelCost(current) - earned;
  const xpToMax = xpToLevel({ level: current, levelXp: earned, target: FRONTLINE_GAME.maxLevel });
  const prestigeSteps = Math.max(0, Math.floor(targetPrestige) - Math.floor(prestige));
  const xpToTarget = prestigeSteps === 0 ? 0 : xpToMax + (prestigeSteps - 1) * xpPerCycle;
  const battlesToTarget = battlesFor({ left: xpToTarget, perBattle: battleXp });
  const reserves = sortBy([...FRONTLINE_RESERVES], (reserve) => FRONTLINE_GAME.reserveUnlockLevel[reserve]);
  const next = reserves.find((reserve) => FRONTLINE_GAME.reserveUnlockLevel[reserve] > current);

  return {
    level: current,
    isMaxLevel,
    xpToNext,
    xpToMax,
    xpPerCycle,
    battlesToNext: battlesFor({ left: xpToNext, perBattle: battleXp }),
    battlesToMax: battlesFor({ left: xpToMax, perBattle: battleXp }),
    battlesToTarget,
    daysToTarget: battlesToTarget === null ? null : battlesFor({ left: battlesToTarget, perBattle: battlesPerDay }),
    prestigeSteps,
    unlocked: reserves.filter((reserve) => FRONTLINE_GAME.reserveUnlockLevel[reserve] <= current),
    nextReserve: next
      ? {
          reserve: next,
          level: FRONTLINE_GAME.reserveUnlockLevel[next],
          battles: battlesFor({
            left: xpToLevel({ level: current, levelXp: earned, target: FRONTLINE_GAME.reserveUnlockLevel[next] }),
            perBattle: battleXp
          })
        }
      : null
  };
};
