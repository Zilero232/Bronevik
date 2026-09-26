'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { getTierList } from '@/shared/api/tanks';
import { QUERY_KEYS } from '@/shared/constants';

import { groupByRank } from '../../../lib/tier-groups';
import { useTanksState } from '../use-tanks-state';

export const useTierList = () => {
  const [{ period, tier }, setState] = useTanksState();
  const { filters } = useVehicleFilters();

  const params = { period, tier, type: filters.types.length === 1 ? filters.types[0] : undefined };

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.tanks.tierList(params),
    queryFn: ({ signal }) => getTierList({ ...params, signal }),
    placeholderData: keepPreviousData
  });

  const onTierChange = (next: string) => {
    void setState({ tier: Number(next) });
  };

  return { tier, groups: groupByRank(data?.entries ?? []), isLoading, isError, isFetching, refetch, onTierChange };
};
