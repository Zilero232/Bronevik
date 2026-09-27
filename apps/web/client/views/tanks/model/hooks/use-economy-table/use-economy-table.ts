'use client';

import type { TankEconomyRow } from '@otmetki/schemas';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ECONOMY_VIEW, economyView } from '@/entities/tank/tank';
import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { tanksQueries } from '../../../api';
import { economyParams } from '../../../lib/view-params';
import { useEconomyColumns } from '../use-economy-columns';
import { useTanksState } from '../use-tanks-state';

export const useEconomyTable = () => {
  const [{ statuses, roles, difficulties, account, reserve, clanPayout }, setState] = useTanksState();
  const { query, reset, isActive } = useVehicleFilters();
  const view = (row: TankEconomyRow) => economyView({ economy: row.economy, account, withReserve: reserve, withClanPayout: clanPayout });
  const columns = useEconomyColumns({ view });

  const economy = useQuery({
    ...tanksQueries.economy(economyParams({ state: { statuses, roles, difficulties, account }, vehicle: query })),
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
