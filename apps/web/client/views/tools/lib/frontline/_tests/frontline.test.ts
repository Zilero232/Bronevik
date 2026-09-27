import { sum } from 'remeda';
import { describe, expect, it } from 'vitest';

import type { FrontlinePlanInput } from '../frontline.types';

import { FRONTLINE_GAME, FRONTLINE_RESERVES } from '../../../config';
import { frontlinePlan, xpToLevel } from '../frontline';

const BASE: FrontlinePlanInput = { level: 1, levelXp: 0, battleXp: 2_000, prestige: 0, targetPrestige: 1, battlesPerDay: 10 };

const CYCLE = sum([...FRONTLINE_GAME.xpToNextLevel]);

describe('frontline game table', () => {
  it('has one step per level up to the cap', () => {
    expect(FRONTLINE_GAME.xpToNextLevel).toHaveLength(FRONTLINE_GAME.maxLevel - 1);
  });

  it('unlocks every reserve inside the level range', () => {
    FRONTLINE_RESERVES.forEach((reserve) => {
      expect(FRONTLINE_GAME.reserveUnlockLevel[reserve]).toBeGreaterThanOrEqual(1);
      expect(FRONTLINE_GAME.reserveUnlockLevel[reserve]).toBeLessThanOrEqual(FRONTLINE_GAME.maxLevel);
    });
  });
});

describe('xpToLevel', () => {
  it('sums the whole table from the first level to the cap', () => {
    expect(xpToLevel({ level: 1, levelXp: 0, target: FRONTLINE_GAME.maxLevel })).toBe(CYCLE);
  });

  it('subtracts the experience already earned inside the level', () => {
    const [first = 0] = FRONTLINE_GAME.xpToNextLevel;

    expect(xpToLevel({ level: 1, levelXp: 100, target: 2 })).toBe(first - 100);
  });

  it('needs nothing for a level already reached', () => {
    expect(xpToLevel({ level: 10, levelXp: 0, target: 5 })).toBe(0);
  });
});

describe('frontlinePlan', () => {
  it('turns the experience to the cap into battles at the average per battle', () => {
    const plan = frontlinePlan(BASE);

    expect(plan.battlesToMax).toBe(Math.ceil(plan.xpToMax / BASE.battleXp));
    expect(plan.battlesToNext).toBe(Math.ceil(plan.xpToNext / BASE.battleXp));
  });

  it('adds a full cycle for every further prestige level', () => {
    const one = frontlinePlan(BASE);
    const three = frontlinePlan({ ...BASE, targetPrestige: 3 });

    expect(three.prestigeSteps).toBe(3);
    expect(three.battlesToTarget).toBe(Math.ceil((one.xpToMax + 2 * CYCLE) / BASE.battleXp));
  });

  it('needs nothing when the target prestige is already reached', () => {
    expect(frontlinePlan({ ...BASE, prestige: 2, targetPrestige: 2 })).toMatchObject({ prestigeSteps: 0, battlesToTarget: 0, daysToTarget: 0 });
  });

  it('spreads the battles over days at the daily pace', () => {
    const plan = frontlinePlan(BASE);

    expect((plan.daysToTarget ?? 0) * BASE.battlesPerDay).toBeGreaterThanOrEqual(plan.battlesToTarget ?? 0);
  });

  it('lists reserves unlocked at the current level and the next one to come', () => {
    const plan = frontlinePlan({ ...BASE, level: 12 });

    expect(plan.unlocked.every((reserve) => FRONTLINE_GAME.reserveUnlockLevel[reserve] <= 12)).toBe(true);
    expect(plan.unlocked.length + (plan.nextReserve ? 1 : 0)).toBeLessThanOrEqual(FRONTLINE_RESERVES.length);
    expect(plan.nextReserve && plan.nextReserve.level).toBeGreaterThan(12);
  });

  it('has everything unlocked and nothing left at the cap', () => {
    const plan = frontlinePlan({ ...BASE, level: FRONTLINE_GAME.maxLevel, levelXp: 5_000 });

    expect(plan).toMatchObject({ isMaxLevel: true, xpToNext: 0, xpToMax: 0, nextReserve: null });
    expect(plan.unlocked).toHaveLength(FRONTLINE_RESERVES.length);
  });

  it('cannot plan without experience per battle', () => {
    expect(frontlinePlan({ ...BASE, battleXp: 0 }).battlesToMax).toBeNull();
  });

  it('caps the experience inside a level below its cost', () => {
    const [first = 0] = FRONTLINE_GAME.xpToNextLevel;

    expect(frontlinePlan({ ...BASE, levelXp: first * 10 }).xpToNext).toBeGreaterThan(0);
  });
});
