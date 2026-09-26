'use client';

import { skipToken, useQuery } from '@tanstack/react-query';

import { getBuildOptions } from '@/entities/tank/build';
import { getTank } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import { BUILD_VIEW } from '../../../config';

export const useBuildData = (slug: string) => {
  const tankQuery = useQuery({
    queryKey: QUERY_KEYS.tanks.detail({ idOrSlug: slug }),
    queryFn: ({ signal }) => getTank({ idOrSlug: slug, signal }),
    staleTime: BUILD_VIEW.staleMs
  });

  const tankId = tankQuery.data?.vehicle.tankId;

  const optionsQuery = useQuery({
    queryKey: QUERY_KEYS.builds.options(tankId ?? 0),
    queryFn: tankId === undefined ? skipToken : ({ signal }) => getBuildOptions({ tankId, signal }),
    staleTime: BUILD_VIEW.staleMs
  });

  const refetch = () => {
    if (tankQuery.isError) {
      void tankQuery.refetch();

      return;
    }

    void optionsQuery.refetch();
  };

  return {
    vehicle: tankQuery.data?.vehicle,
    options: optionsQuery.data,
    isPending: tankQuery.isPending || (tankId !== undefined && optionsQuery.isPending),
    isRetrying: tankQuery.isFetching || optionsQuery.isFetching,
    error: tankQuery.error ?? optionsQuery.error,
    refetch
  };
};
