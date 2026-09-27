'use client';

import type { TankEconomyRow } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ECONOMY_VIEW, economyView, listTankEconomy } from '@/entities/tank/tank';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';
import { QUERY_KEYS } from '@/shared/constants';

import { TANKS_ECONOMY } from '../../../config';
import { useEconomyColumns } from '../use-economy-columns';
import { useTanksState } from '../use-tanks-state';

export const useEconomyTable = () => {
  const [{ statuses, roles, difficulties, account, reserve, clanPayout }, setState] = useTanksState();
  const { query, reset, isActive } = useVehicleFilters();
  const view = (row: TankEconomyRow) => economyView({ economy: row.economy, account, withReserve: reserve, withClanPayout: clanPayout });
  const columns = useEconomyColumns({ view });

  const params = { ...query, statuses, roles, difficulties, account, limit: TANKS_ECONOMY.limit };

  const economy = useQuery({
    queryKey: QUERY_KEYS.tanks.economy(params),
    queryFn: ({ signal }) => listTankEconomy({ ...params, signal }),
    placeholderData: keepPreviousData
  });

  const onReset = () => {
    void reset();
    void setState({ statuses: null, roles: null, difficulties: null });
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
    view,
    query: economy,
    account,
    reserve,
    clanPayout,
    clanPayoutPercent: ECONOMY_VIEW.clanPayoutBonus * 100,
    isFiltered: isActive || statuses.length > 0 || roles.length > 0 || difficulties.length > 0,
    onReset,
    onAccountChange,
    onReserveChange,
    onClanPayoutChange
  };
};
