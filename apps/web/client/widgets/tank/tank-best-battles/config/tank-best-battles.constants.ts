import type { BestBattleMetric, BestBattlePeriod } from '@/entities/battle/best-battle';

export const TANK_BEST_BATTLES = {
  limit: 5,
  period: 'month',
  metric: 'damage',
  staleMs: 120_000,
  rowHeight: 52,
  medalsInRow: 3,
  medalSize: 22
} as const satisfies { period: BestBattlePeriod; metric: BestBattleMetric; [key: string]: number | string };
