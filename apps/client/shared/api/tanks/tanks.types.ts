import type {
  RatingPeriod,
  ServerPeriod,
  SkillCohort,
  SortOrder,
  StatsMode,
  TankServerStatsSortField,
  TopPlayersMetric,
  VehicleProfileId,
  VehicleStats,
  VehicleType
} from '@bronevik/schemas';

import type { MockTank } from '@/shared/mocks';

export type TankStatsInput = {
  period?: ServerPeriod;
  cohort?: SkillCohort;
  mode?: StatsMode;
  tiers?: number[];
  types?: VehicleType[];
  nations?: string[];
  premium?: boolean;
  sort?: TankServerStatsSortField;
  order?: SortOrder;
  limit?: number;
  offset?: number;
  minBattles?: number;
  signal?: AbortSignal;
};

export type TierListInput = {
  period?: ServerPeriod;
  mode?: StatsMode;
  tier?: number;
  type?: VehicleType;
  minBattles?: number;
  signal?: AbortSignal;
};

export type TankDetailInput = {
  idOrSlug: string;
  period?: ServerPeriod;
  mode?: StatsMode;
  signal?: AbortSignal;
};

export type TankTopPlayersInput = {
  tankId: number;
  period?: RatingPeriod;
  metric?: TopPlayersMetric;
  limit?: number;
  minBattles?: number;
  signal?: AbortSignal;
};

export type TankTrendInput = {
  tankId: number;
  days?: number;
  mode?: StatsMode;
  signal?: AbortSignal;
};

export type TankPatchesInput = {
  tankId: number;
  signal?: AbortSignal;
};

export type VehicleCatalogInput = {
  signal?: AbortSignal;
};

export type CompareTanksInput = {
  tankIds: number[];
  signal?: AbortSignal;
};

export type MockTopEntriesInput = {
  seed: number;
  limit: number;
  base: number;
};

export type MockVehicleStatsInput = {
  tank: MockTank;
  profile: VehicleProfileId;
};

export type MockTopValueInput = {
  tankId: number;
  metric: TopPlayersMetric;
};

export type MockSpecInput = {
  stats: VehicleStats;
  key: string;
};
