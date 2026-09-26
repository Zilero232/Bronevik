import type {
  BuildCohort,
  BuildMode,
  BuildsCatalogQuery,
  BuildUsageQuery,
  Loadout,
  ParsedLoadoutRequest,
  PopularBuildsQuery
} from '@otmetki/schemas';

import type { BuildUsageAggregate } from '../../../generated';

export type ProgressionData = {
  tree: unknown;
  pairs: unknown[];
};

export type CalculateLoadoutInput = {
  tankId: number;
  request: ParsedLoadoutRequest;
};

export type PopularBuildsInput = {
  tankId: number;
  query: PopularBuildsQuery;
};

export type BattleSamplesInput = {
  tankId: number;
  mode: BuildMode | undefined;
};

export type BuildUsageInput = {
  tankId: number;
  mode: BuildMode;
  cohort: BuildCohort;
};

export type RecommendedBuildInput = {
  tankId: number;
  query: BuildUsageQuery;
  viewerUserId: string | null;
};

export type BuildHistoryInput = {
  tankId: number;
  query: BuildUsageQuery;
};

export type BuildsCatalogInput = BuildsCatalogQuery;

export type CatalogUsageRow = Pick<BuildUsageAggregate, 'avgDamage' | 'battles' | 'computedAt' | 'players' | 'tankId' | 'winRate'> & {
  usage: unknown;
};

export type EnsureCohortInput = {
  cohort: BuildCohort;
  viewerUserId: string | null;
};

export type CalculateRecommendedInput = {
  tankId: number;
  loadout: Loadout;
};
