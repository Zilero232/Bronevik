'use client';

import { skipToken, useQuery } from '@tanstack/react-query';

import { getBuildOptions } from '@/shared/api/builds';
import { getTank } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { BUILD_VIEW } from '../../config';

export const useBuildData = (slug: string) => {
  const {
    data: tank,
    isPending: isTankPending,
    error: tankError
  } = useQuery({
    queryKey: QUERY_KEYS.tanks.detail({ idOrSlug: slug }),
    queryFn: ({ signal }) => getTank({ idOrSlug: slug, signal }),
    staleTime: BUILD_VIEW.staleMs
  });

  const tankId = tank?.vehicle.tankId;

  const {
    data: options,
    isPending: isOptionsPending,
    error: optionsError
  } = useQuery({
    queryKey: QUERY_KEYS.builds.options(tankId ?? 0),
    queryFn: tankId === undefined ? skipToken : ({ signal }) => getBuildOptions({ tankId, signal }),
    staleTime: BUILD_VIEW.staleMs
  });

  return {
    vehicle: tank?.vehicle,
    options,
    isPending: isTankPending || (tankId !== undefined && isOptionsPending),
    error: tankError ?? optionsError
  };
};
