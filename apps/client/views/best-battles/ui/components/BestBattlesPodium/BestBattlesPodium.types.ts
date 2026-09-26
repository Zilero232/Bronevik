import type { BestBattle, BestBattleMetric } from '@/entities/battle/best-battle';

export type BestBattlesPodiumProps = {
  battles: BestBattle[];
  metric: BestBattleMetric;
};
