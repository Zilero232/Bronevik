'use client';

import { useTanksFilterContext } from '../../context';
import { usePlayerTanks } from '../use-profile-queries';

export const useTanksTab = () => {
  const { request, matches } = useTanksFilterContext();
  const query = usePlayerTanks(request);

  return {
    query,
    rows: query.data?.items.filter(({ vehicle }) => matches(vehicle.name)) ?? []
  };
};
