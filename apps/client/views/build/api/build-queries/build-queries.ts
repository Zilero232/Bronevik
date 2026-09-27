import { queryOptions } from '@tanstack/react-query';

import { getBuildOptions, getRecommendedBuild, listPopularBuilds } from '@/entities/tank/build';
import { getTank } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import type { RecommendedBuildParams, TankDetailParams } from './build-queries.types';

import { BUILD_VIEW } from '../../config';

export const buildQueries = {
  tank: (params: TankDetailParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.detail(params),
      queryFn: ({ signal }) => getTank({ ...params, signal }),
      staleTime: BUILD_VIEW.staleMs
    }),
  options: (tankId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.builds.options(tankId),
      queryFn: ({ signal }) => getBuildOptions({ tankId, signal }),
      staleTime: BUILD_VIEW.staleMs
    }),
  popular: (tankId: number) =>
    queryOptions({
      queryKey: QUERY_KEYS.builds.popular(tankId),
      queryFn: ({ signal }) => listPopularBuilds({ tankId, signal }),
      staleTime: BUILD_VIEW.staleMs
    }),
  recommended: (params: RecommendedBuildParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.builds.recommended(params),
      queryFn: ({ signal }) => getRecommendedBuild({ ...params, signal }),
      staleTime: BUILD_VIEW.staleMs
    })
};
