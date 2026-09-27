'use client';

import { usePlayerTanks } from '../use-profile-queries';
import { useTanksFilter } from '../use-tanks-filter';

export const useTanksTab = () => {
  const filters = useTanksFilter();
  const query = usePlayerTanks(filters.request);

  return {
    filters,
    query,
    rows: query.data?.items.filter(({ vehicle }) => filters.matches(vehicle.name)) ?? []
  };
};
