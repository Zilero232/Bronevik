import type { BuildCohort, BuildMode, LoadoutRequest } from '@otmetki/schemas';

import type { BuildsCatalogControllerListData } from '@/shared/api/generated';

export type BuildOptionsInput = {
  tankId: number;
  signal?: AbortSignal;
};

export type CalculateLoadoutInput = BuildOptionsInput & {
  request: LoadoutRequest;
};

export type PopularBuildsInput = BuildOptionsInput & {
  limit?: number;
};

export type RecommendedBuildInput = BuildOptionsInput & {
  mode: BuildMode;
  cohort: BuildCohort;
};

export type BuildHistoryInput = RecommendedBuildInput;

type BuildsCatalogQuery = NonNullable<BuildsCatalogControllerListData['query']>;

export type BuildsCatalogInput = Omit<BuildsCatalogQuery, 'mode'> &
  Required<Pick<BuildsCatalogQuery, 'mode'>> & {
    signal?: AbortSignal;
  };
