import type { BuildCohort, BuildMode, LoadoutRequest, VehicleType } from '@otmetki/schemas';

export type BuildOptionsInput = {
  tankId: number;
  signal?: AbortSignal;
};

export type CalculateLoadoutInput = {
  tankId: number;
  request: LoadoutRequest;
  signal?: AbortSignal;
};

export type PopularBuildsInput = {
  tankId: number;
  limit?: number;
  signal?: AbortSignal;
};

export type RecommendedBuildInput = {
  tankId: number;
  mode: BuildMode;
  cohort: BuildCohort;
  signal?: AbortSignal;
};

export type BuildHistoryInput = RecommendedBuildInput;

export type BuildsCatalogInput = {
  mode: BuildMode;
  tiers?: number[];
  types?: VehicleType[];
  nations?: string[];
  signal?: AbortSignal;
};
