'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { getTierList } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { useTanksState } from './use-tanks-state';

export const useTierList = () => {
  const [{ period, tier }] = useTanksState();
  const { filters } = useVehicleFilters();

  const params = { period, tier, type: filters.types.length === 1 ? filters.types[0] : undefined };

  return useQuery({
    queryKey: QUERY_KEYS.tanks.tierList(params),
    queryFn: ({ signal }) => getTierList({ ...params, signal }),
    placeholderData: keepPreviousData
  });
};
