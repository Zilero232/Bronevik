import type { LeaderboardScope, RatingKind, RatingPeriod, VehicleType } from '@bronevik/schemas';

import type { TankIdentityData } from '@/entities/tank/tank';

export type TopTank = TankIdentityData & {
  tankId: number;
};

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
