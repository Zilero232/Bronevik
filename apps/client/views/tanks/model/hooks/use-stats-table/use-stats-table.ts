'use client';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { useTankColumns } from '../use-tank-columns';
import { useTankStats } from '../use-tank-stats';
import { useTanksState } from '../use-tanks-state';

export const useStatsTable = () => {
  const { data, isLoading, isError, isFetching, refetch } = useTankStats();
  const [{ statuses, roles, difficulties }, setState] = useTanksState();
  const { reset, isActive } = useVehicleFilters();
  const columns = useTankColumns();

  const onReset = () => {
    void reset();
    void setState({ statuses: null, roles: null, difficulties: null });
  };

  const onRetry = () => {
    void refetch();
  };

  return {
    columns,
    rows: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    isFetching,
    isFiltered: isActive || statuses.length > 0 || roles.length > 0 || difficulties.length > 0,
    onReset,
    onRetry
  };
};
