'use client';

import { useQuery } from '@tanstack/react-query';

import { listPopularBuilds } from '@/entities/tank/build';
import { QUERY_KEYS } from '@/shared/constants';

import { BUILD_VIEW } from '../../../config';

export const usePopularBuilds = (tankId: number) =>
  useQuery({
    queryKey: QUERY_KEYS.builds.popular(tankId),
    queryFn: ({ signal }) => listPopularBuilds({ tankId, signal }),
    staleTime: BUILD_VIEW.staleMs
  });
