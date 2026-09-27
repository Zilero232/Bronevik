import type { BuildCohort, BuildMode, LoadoutRequest } from '@otmetki/schemas';

import type { BuildsCatalogControllerListData } from '@/shared/api/generated';

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

type BuildsCatalogQuery = NonNullable<BuildsCatalogControllerListData['query']>;

export type BuildsCatalogInput = Omit<BuildsCatalogQuery, 'mode'> &
  Required<Pick<BuildsCatalogQuery, 'mode'>> & {
    signal?: AbortSignal;
  };
