'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useVehicleFilters } from '@/features/tank/filter-vehicles';

import { tanksQueries } from '../../../api';
import { groupByRank } from '../../../lib/tier-groups';
import { tierListParams } from '../../../lib/view-params';
import { useTanksState } from '../use-tanks-state';

export const useTierList = () => {
  const [{ period, tier }, setState] = useTanksState();
  const { filters } = useVehicleFilters();

  const query = useQuery({
    ...tanksQueries.tierList(tierListParams({ state: { period, tier }, filters })),
    placeholderData: keepPreviousData,
    select: ({ entries }) => groupByRank(entries)
  });

  const onTierChange = (next: string) => {
    void setState({ tier: Number(next) });
  };

  return { tier, query, onTierChange };
};
