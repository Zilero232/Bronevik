import { queryOptions } from '@tanstack/react-query';

import { getTierList, listTankEconomy, listTankStats } from '@/entities/tank/tank';
import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

import type { EconomyTableQueryInput, TankStatsQueryInput, TierListQueryInput } from './tanks-queries.types';

export const tanksQueries = {
  stats: (params: TankStatsQueryInput) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.stats(params),
      queryFn: ({ signal }) => listTankStats({ ...params, signal }),
      staleTime: PREFETCHED_STALE_TIME
    }),
  tierList: (params: TierListQueryInput) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.tierList(params),
      queryFn: ({ signal }) => getTierList({ ...params, signal }),
      staleTime: PREFETCHED_STALE_TIME
    }),
  economy: (params: EconomyTableQueryInput) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.economy(params),
      queryFn: ({ signal }) => listTankEconomy({ ...params, signal }),
      staleTime: PREFETCHED_STALE_TIME
    })
};
