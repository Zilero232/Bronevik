import { addDays } from 'date-fns';
import { clamp } from 'remeda';

import type { BattlePassPlan, BattlePassPlanInput } from './battle-pass.types';

import { battlesFor } from '../research-plan';

export const battlePassPlan = ({
  stage,
  stagePoints,
  pointsPerStage,
  stages,
  daysLeft,
  pointsPerBattle,
  battlesPerDay,
  today
}: BattlePassPlanInput): BattlePassPlan => {
  const total = stages * pointsPerStage;
  const earned = clamp(stage * pointsPerStage + stagePoints, { min: 0, max: total });
  const pointsLeft = total - earned;
  const battlesNeeded = battlesFor({ left: pointsLeft, perBattle: pointsPerBattle });
  const daysNeeded = battlesNeeded === null ? null : battlesFor({ left: battlesNeeded, perBattle: battlesPerDay });

  return {
    total,
    earned,
    pointsLeft,
    progress: total > 0 ? earned / total : 1,
    battlesNeeded,
    battlesPerDayNeeded: battlesNeeded === null ? null : battlesFor({ left: battlesNeeded, perBattle: daysLeft }),
    daysNeeded,
    finishDate: daysNeeded === null || today === null ? null : addDays(today, daysNeeded),
    isOnTrack: daysNeeded !== null && daysNeeded <= daysLeft
  };
};
