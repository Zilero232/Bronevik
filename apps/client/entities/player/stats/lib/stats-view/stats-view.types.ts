import type { RatingScale } from '@otmetki/ratings';
import type { RatingPeriod, RecentPeriods, StatsBlock } from '@otmetki/schemas';

export type PeriodStatsInput = {
  overall: StatsBlock;
  recent: RecentPeriods;
  period: RatingPeriod;
};

export type StatsDeltaInput = {
  current: number | null;
  reference: number | null;
};

export type SignedInput = {
  value: number | undefined;
  digits?: number;
};

export type ScaledRatingInput = {
  scale: RatingScale;
  value: number | null;
};
