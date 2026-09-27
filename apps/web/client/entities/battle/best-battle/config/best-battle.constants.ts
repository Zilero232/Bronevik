import type { BestBattleMetric, BestBattlePeriod } from '../api';

export const BEST_BATTLE_PERIODS = ['day', 'week', 'month'] as const satisfies readonly BestBattlePeriod[];

export const BEST_BATTLE_METRICS = ['damage', 'assisted', 'spotted', 'frags', 'xp', 'blocked'] as const satisfies readonly BestBattleMetric[];

export const BEST_BATTLE = {
  defaultPeriod: 'week',
  defaultMetric: 'damage',
  medalSize: 28
} as const satisfies { defaultPeriod: BestBattlePeriod; defaultMetric: BestBattleMetric; medalSize: number };
