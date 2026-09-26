'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { QUERY_KEYS } from '@/shared/constants';

import { TANKS_VIEW } from '../../../config';
import { useTanksState } from '../use-tanks-state';

export const useTankStats = () => {
  const [{ period, cohort, statuses, roles, difficulties }] = useTanksState();
  const { query } = useVehicleFilters();

  const params = { period, cohort, ...query, statuses, roles, difficulties, limit: TANKS_VIEW.statsLimit };

  return useQuery({
    queryKey: QUERY_KEYS.tanks.stats(params),
    queryFn: ({ signal }) => listTankStats({ ...params, signal }),
    placeholderData: keepPreviousData
  });
};
