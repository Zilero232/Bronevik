import type { PlayerProfile, RatingPeriod, StatsBlock } from '@bronevik/schemas';

export type PeriodRatingsInput = {
  profile: PlayerProfile;
  periods: readonly RatingPeriod[];
};

export type PeriodRatingRow = {
  period: RatingPeriod;
  stats: StatsBlock;
};
