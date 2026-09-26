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
