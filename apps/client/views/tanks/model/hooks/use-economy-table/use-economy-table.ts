'use client';

import type { TankEconomyRow } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { listTankEconomy } from '@/shared/api/tanks';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { TANKS_ECONOMY } from '../../../config';
import { useEconomyColumns } from '../use-economy-columns';
import { useTanksState } from '../use-tanks-state';

export const useEconomyTable = () => {
  const router = useRouter();
  const [{ statuses, roles, account, reserve }, setState] = useTanksState();
  const { query, reset, isActive } = useVehicleFilters();
  const columns = useEconomyColumns({ account, withReserve: reserve });

  const params = { ...query, statuses, roles, account, limit: TANKS_ECONOMY.limit };

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.tanks.economy(params),
    queryFn: ({ signal }) => listTankEconomy({ ...params, signal }),
    placeholderData: keepPreviousData
  });

  const onRowClick = (row: TankEconomyRow) => {
    router.push(ROUTES.tank(row.vehicle.slug));
  };

  const onRetry = () => {
    void refetch();
  };

  const onAccountChange = (next: typeof account) => {
    void setState({ account: next });
  };

  const onReserveChange = (next: boolean) => {
    void setState({ reserve: next || null });
  };

  return {
    columns,
    rows: data?.items ?? [],
    total: data?.total ?? 0,
    account,
    reserve,
    isLoading,
    isError,
    isFetching,
    isFiltered: isActive || statuses.length > 0 || roles.length > 0,
    onReset: reset,
    onRetry,
    onRowClick,
    onAccountChange,
    onReserveChange
  };
};
