'use client';

import type { TankServerStatsRow } from '@otmetki/schemas';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { useTankColumns } from '../use-tank-columns';
import { useTankStats } from '../use-tank-stats';

export const useStatsTable = () => {
  const router = useRouter();
  const { data, isLoading, isError, isFetching, refetch } = useTankStats();
  const { reset, isActive } = useVehicleFilters();
  const columns = useTankColumns();

  const onRowClick = (row: TankServerStatsRow) => {
    router.push(ROUTES.tank(row.vehicle.slug));
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
    isFiltered: isActive,
    onReset: reset,
    onRetry,
    onRowClick
  };
};
