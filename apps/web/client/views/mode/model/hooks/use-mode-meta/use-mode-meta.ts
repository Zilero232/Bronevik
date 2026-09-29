'use client';

import type { PlayMode } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getModeMeta } from '@/entities/mode/mode';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { QUERY_KEYS } from '@/shared/constants';

export const useModeMeta = (mode: PlayMode) => {
  const { query } = useVehicleFilters();

  const params = { mode, ...query };

  return useQuery({
    queryKey: QUERY_KEYS.modes.meta(params),
    queryFn: ({ signal }) => getModeMeta({ ...params, signal }),
    placeholderData: keepPreviousData
  });
};
