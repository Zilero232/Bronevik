import type { BestBattleMetric, BestBattleRow } from '../../best-battles.types';

export type BattleKeyInput = Pick<BestBattleRow, 'account_id' | 'arena_unique_id' | 'battle_id' | 'source'>;

export type SortByMetricInput = {
  rows: readonly BestBattleRow[];
  metric: BestBattleMetric;
};

export type MergeFeedInput = SortByMetricInput & {
  offset: number;
  limit: number;
};

export type RankedBattleRow = BestBattleRow & {
  key: string;
  rank: number;
};

export type MergedFeed = {
  rows: RankedBattleRow[];
  nextOffset: number | null;
};
