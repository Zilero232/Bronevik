'use client';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { useTankColumns } from '../use-tank-columns';
import { useTankStats } from '../use-tank-stats';
import { useTanksState } from '../use-tanks-state';

export const useStatsTable = () => {
  const query = useTankStats();
  const [{ statuses, roles, difficulties }, setState] = useTanksState();
  const { reset, isActive } = useVehicleFilters();
  const columns = useTankColumns();

  const onReset = () => {
    void reset();
    void setState({ statuses: null, roles: null, difficulties: null });
  };

  return {
    columns,
    query,
    isFiltered: isActive || statuses.length > 0 || roles.length > 0 || difficulties.length > 0,
    onReset
  };
};
