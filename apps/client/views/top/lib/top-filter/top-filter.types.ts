import type { LeaderboardScope, RatingKind, RatingPeriod, VehicleSummary, VehicleType } from '@otmetki/schemas';

export type TopTank = VehicleSummary;

export type TopFilterState = {
  scope: LeaderboardScope;
  metric: RatingKind;
  period: RatingPeriod;
  tier: 'all' | `${number}`;
  type: 'all' | VehicleType;
  tank: TopTank | null;
};

export type MetricForInput = {
  scope: LeaderboardScope;
  metric: RatingKind;
};
