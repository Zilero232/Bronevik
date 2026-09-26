'use client';

import type { TankEconomyRow } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ECONOMY_VIEW } from '@/entities/tank/tank';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { listTankEconomy } from '@/entities/tank/tank';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import { TANKS_ECONOMY } from '../../../config';
import { useEconomyColumns } from '../use-economy-columns';
import { useTanksState } from '../use-tanks-state';

export const useEconomyTable = () => {
  const router = useRouter();
  const [{ statuses, roles, difficulties, account, reserve, clanPayout }, setState] = useTanksState();
  const { query, reset, isActive } = useVehicleFilters();
  const columns = useEconomyColumns({ account, withReserve: reserve, withClanPayout: clanPayout });

  const params = { ...query, statuses, roles, difficulties, account, limit: TANKS_ECONOMY.limit };

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.tanks.economy(params),
    queryFn: ({ signal }) => listTankEconomy({ ...params, signal }),
    placeholderData: keepPreviousData
  });

  const onRowClick = (row: TankEconomyRow) => {
    router.push(ROUTES.tanks.detail(row.vehicle.slug));
  };

  const onReset = () => {
    void reset();
    void setState({ statuses: null, roles: null, difficulties: null });
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

  const onClanPayoutChange = (next: boolean) => {
    void setState({ clanPayout: next || null });
  };

  return {
    columns,
    rows: data?.items ?? [],
    total: data?.total ?? 0,
    account,
    reserve,
    clanPayout,
    clanPayoutPercent: ECONOMY_VIEW.clanPayoutBonus * 100,
    isLoading,
    isError,
    isFetching,
    isFiltered: isActive || statuses.length > 0 || roles.length > 0 || difficulties.length > 0,
    onReset,
    onRetry,
    onRowClick,
    onAccountChange,
    onReserveChange,
    onClanPayoutChange
  };
};
