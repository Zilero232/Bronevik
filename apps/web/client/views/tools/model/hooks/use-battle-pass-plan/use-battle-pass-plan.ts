'use client';

import { clamp } from 'remeda';

import type { BattlePassValues } from './use-battle-pass-plan.types';

import { battlePassPlan } from '../../../lib/battle-pass';
import { useToday } from '../use-today';

export const useBattlePassPlan = (values: BattlePassValues) => {
  const today = useToday();

  const plan = battlePassPlan({
    stage: values.stage ?? 0,
    stagePoints: values.stagePoints ?? 0,
    pointsPerStage: values.pointsPerStage ?? 0,
    stages: values.stages ?? 0,
    daysLeft: values.daysLeft ?? 0,
    pointsPerBattle: values.pointsPerBattle ?? 0,
    battlesPerDay: values.battlesPerDay,
    today
  });

  const isPaceEnough = plan.battlesPerDayNeeded !== null && plan.battlesPerDayNeeded <= values.battlesPerDay;

  return { plan, progress: clamp(plan.progress, { min: 0, max: 1 }), daysLeft: values.daysLeft ?? 0, isPaceEnough };
};
