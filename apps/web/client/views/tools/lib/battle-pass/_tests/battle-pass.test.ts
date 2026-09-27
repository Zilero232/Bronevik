import { differenceInCalendarDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import type { BattlePassPlanInput } from '../battle-pass.types';

import { battlePassPlan } from '../battle-pass';

const TODAY = new Date(2026, 8, 24);

const BASE: BattlePassPlanInput = {
  stage: 10,
  stagePoints: 25,
  pointsPerStage: 50,
  stages: 50,
  daysLeft: 30,
  pointsPerBattle: 5,
  battlesPerDay: 10,
  today: TODAY
};

describe('battlePassPlan', () => {
  it('counts the points left from the finished stages and the current one', () => {
    const plan = battlePassPlan(BASE);

    expect(plan.pointsLeft).toBe(BASE.stages * BASE.pointsPerStage - (BASE.stage * BASE.pointsPerStage + BASE.stagePoints));
    expect(plan.earned + plan.pointsLeft).toBe(plan.total);
  });

  it('turns the points left into battles at the average per battle', () => {
    const plan = battlePassPlan(BASE);

    expect(plan.battlesNeeded).toBe(Math.ceil(plan.pointsLeft / BASE.pointsPerBattle));
  });

  it('spreads the battles over the remaining days', () => {
    const plan = battlePassPlan(BASE);

    expect((plan.battlesPerDayNeeded ?? 0) * BASE.daysLeft).toBeGreaterThanOrEqual(plan.battlesNeeded ?? 0);
  });

  it('dates the finish by the current daily pace', () => {
    const plan = battlePassPlan(BASE);

    expect(plan.finishDate && differenceInCalendarDays(plan.finishDate, TODAY)).toBe(plan.daysNeeded);
  });

  it('flags a pace too slow for the days left', () => {
    expect(battlePassPlan({ ...BASE, battlesPerDay: 1 }).isOnTrack).toBe(false);
    expect(battlePassPlan({ ...BASE, battlesPerDay: 50 }).isOnTrack).toBe(true);
  });

  it('needs nothing once the pass is complete', () => {
    const plan = battlePassPlan({ ...BASE, stage: BASE.stages });

    expect(plan).toMatchObject({ pointsLeft: 0, battlesNeeded: 0, progress: 1, isOnTrack: true });
  });

  it('cannot plan without points per battle', () => {
    expect(battlePassPlan({ ...BASE, pointsPerBattle: 0 }).battlesNeeded).toBeNull();
  });

  it('has no finish date before the current day is known', () => {
    expect(battlePassPlan({ ...BASE, today: null }).finishDate).toBeNull();
  });
});
