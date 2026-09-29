'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { listBuildsCatalog } from '@/entities/tank/build';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { QUERY_KEYS } from '@/shared/constants';

import { useCatalogState } from '../use-catalog-state';

export const useBuildsCatalog = () => {
  const [{ mode, difficulties }] = useCatalogState();
  const { query } = useVehicleFilters();

  const params = { mode, ...query, difficulties };

  return useQuery({
    queryKey: QUERY_KEYS.builds.catalog(params),
    queryFn: ({ signal }) => listBuildsCatalog({ ...params, signal }),
    placeholderData: keepPreviousData
  });
};
