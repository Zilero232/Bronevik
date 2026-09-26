'use client';

import { usePlayerTanks } from '../use-profile-queries';
import { useTanksFilter } from '../use-tanks-filter';

export const useTanksTab = () => {
  const filters = useTanksFilter();
  const { data: page, isPending, isError, isRefetching, refetch } = usePlayerTanks(filters.request);

  return {
    filters,
    rows: page?.items.filter(({ vehicle }) => filters.matches(vehicle.name)) ?? [],
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
