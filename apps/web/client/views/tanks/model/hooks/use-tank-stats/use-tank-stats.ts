'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { tanksQueries } from '../../../api';
import { statsParams } from '../../../lib/stats-params';
import { useTanksState } from '../use-tanks-state';

export const useTankStats = () => {
  const [state] = useTanksState();
  const { filters } = useVehicleFilters();

  return useQuery({ ...tanksQueries.stats(statsParams({ state, filters })), placeholderData: keepPreviousData });
};
