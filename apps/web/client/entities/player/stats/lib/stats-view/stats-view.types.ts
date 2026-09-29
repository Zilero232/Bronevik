import type { RatingScale } from '@otmetki/ratings';
import type { RatingPeriod, RecentPeriods, StatsBlock } from '@otmetki/schemas';

export type PeriodStatsInput = {
  overall: StatsBlock;
  recent: RecentPeriods;
  period: RatingPeriod;
};

export type StatsTrendKey = 'avgDamage' | 'winRate' | 'wn8';

export type TrendDeltaInput = {
  key: StatsTrendKey;
  stats: StatsBlock;
  reference: StatsBlock | null | undefined;
};

export type StatsDeltaInput = {
  current: number | null;
  reference: number | null;
};

export type ScaledRatingInput = {
  scale: RatingScale;
  value: number | null;
};
