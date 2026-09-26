'use client';

import type { PlayMode } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getModeMeta } from '@/entities/mode/mode';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { QUERY_KEYS } from '@/shared/constants';

export const useModeMeta = (mode: PlayMode) => {
  const { filters } = useVehicleFilters();

  const params = { mode, tiers: filters.tiers, types: filters.types, nations: filters.nations };

  const { data, isPending, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.modes.meta(params),
    queryFn: ({ signal }) => getModeMeta({ ...params, signal }),
    placeholderData: keepPreviousData
  });

  return { data, isPending, isLoading, isError, isRetrying: isFetching, onRetry: () => void refetch() };
};
