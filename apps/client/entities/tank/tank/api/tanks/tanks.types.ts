import type {
  EconomyAccount,
  LearningDifficulty,
  RatingPeriod,
  ServerPeriod,
  SkillCohort,
  SortOrder,
  StatsMode,
  TankEconomySortField,
  TankRole,
  TankServerStatsSortField,
  TankStatus,
  TopPlayersMetric,
  VehicleType
} from '@otmetki/schemas';

export type TankStatsInput = {
  period?: ServerPeriod;
  cohort?: SkillCohort;
  mode?: StatsMode;
  tiers?: number[];
  types?: VehicleType[];
  nations?: string[];
  statuses?: TankStatus[];
  roles?: TankRole[];
  difficulties?: LearningDifficulty[];
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

export type TankEconomyTableInput = {
  account?: EconomyAccount;
  tiers?: number[];
  types?: VehicleType[];
  nations?: string[];
  statuses?: TankStatus[];
  roles?: TankRole[];
  difficulties?: LearningDifficulty[];
  sort?: TankEconomySortField;
  order?: SortOrder;
  limit?: number;
  offset?: number;
  minBattles?: number;
  signal?: AbortSignal;
};

export type TankEconomyInput = {
  tankId: number;
  signal?: AbortSignal;
};

export type MyEconomyInput = {
  days: number;
  signal?: AbortSignal;
};

export type MyLearningInput = {
  tankId: number;
  signal?: AbortSignal;
};
