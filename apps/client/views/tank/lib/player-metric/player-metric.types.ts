import type { LeaderboardEntry, TopPlayersMetric } from '@otmetki/schemas';

import type { RatingTone } from '@/shared/lib';

export type PlayerMetricInput = {
  metric: TopPlayersMetric;
  entry: LeaderboardEntry;
};

export type PlayerMetricDisplay = {
  value: number;
  tone: RatingTone;
  isPercent: boolean;
};
