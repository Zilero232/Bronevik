import type { BestBattleMetric } from '../../best-battles.types';

export type FeedScope = {
  since: Date;
  battleTypes: readonly string[];
  tankIds: readonly number[] | null;
  arenaId?: string;
  medal?: string;
};

export type FeedSqlInput = FeedScope & {
  metric: BestBattleMetric;
  take: number;
};
