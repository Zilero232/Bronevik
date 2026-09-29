'use client';

import type { PlayMode } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getModeMeta } from '@/entities/mode/mode';
import { useVehicleFilters, useVehicleTraitFilter } from '@/features/tank/filter-vehicles';
import { QUERY_KEYS } from '@/shared/constants';

export const useModeMeta = (mode: PlayMode) => {
  const { query } = useVehicleFilters();
  const byTraits = useVehicleTraitFilter();

  const params = { mode, ...query };

  return useQuery({
    queryKey: QUERY_KEYS.modes.meta(params),
    queryFn: ({ signal }) => getModeMeta({ ...params, signal }),
    placeholderData: keepPreviousData,
    select: (meta) => ({ ...meta, tanks: byTraits({ rows: meta.tanks, vehicleOf: ({ vehicle }) => vehicle }) })
  });
};
