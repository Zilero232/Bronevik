import type { BuildHistory, BuildOptions, BuildsCatalog, LoadoutResult, PopularBuilds, RecommendedBuild } from '@otmetki/schemas';

import type {
  BuildHistoryInput,
  BuildOptionsInput,
  BuildsCatalogInput,
  CalculateLoadoutInput,
  PopularBuildsInput,
  RecommendedBuildInput
} from './builds.types';

import {
  buildsCatalogControllerList,
  buildsControllerHistory,
  buildsControllerLoadout,
  buildsControllerOptions,
  buildsControllerPopular,
  buildsControllerRecommended
} from '@/shared/api/generated';
import { listParam } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';
import { BUILD_REQUEST } from './builds.constants';

export const getBuildOptions = ({ signal, tankId }: BuildOptionsInput): Promise<BuildOptions> =>
  fromSdk(() => buildsControllerOptions({ path: { id: tankId }, signal }));

export const calculateLoadout = ({ signal, tankId, request }: CalculateLoadoutInput): Promise<LoadoutResult> =>
  fromSdk(() => buildsControllerLoadout({ path: { id: tankId }, body: request, signal }));

export const listPopularBuilds = ({ signal, tankId, limit = BUILD_REQUEST.popularLimit }: PopularBuildsInput): Promise<PopularBuilds> =>
  fromSdk(() => buildsControllerPopular({ path: { id: tankId }, query: { limit }, signal }));

export const getRecommendedBuild = ({ signal, tankId, mode, cohort }: RecommendedBuildInput): Promise<RecommendedBuild> =>
  fromSdk(() => buildsControllerRecommended({ path: { id: tankId }, query: { mode, cohort }, signal }));

export const getBuildHistory = ({ signal, tankId, mode, cohort }: BuildHistoryInput): Promise<BuildHistory> =>
  fromSdk(() => buildsControllerHistory({ path: { id: tankId }, query: { mode, cohort }, signal }));

export const listBuildsCatalog = ({ signal, tiers, types, nations, difficulties, mode }: BuildsCatalogInput): Promise<BuildsCatalog> =>
  fromSdk(() =>
    buildsCatalogControllerList({
      query: { mode, tiers: listParam(tiers), types: listParam(types), nations: listParam(nations), difficulties: listParam(difficulties) },
      signal
    })
  );
