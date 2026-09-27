import { queryOptions } from '@tanstack/react-query';

import { getTierList, listTankEconomy, listTankStats } from '@/entities/tank/tank';
import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

import type { EconomyTableParams, TankStatsParams, TierListParams } from './tanks-queries.types';

export const tanksQueries = {
  stats: (params: TankStatsParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.stats(params),
      queryFn: ({ signal }) => listTankStats({ ...params, signal }),
      staleTime: PREFETCHED_STALE_TIME
    }),
  tierList: (params: TierListParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.tierList(params),
      queryFn: ({ signal }) => getTierList({ ...params, signal }),
      staleTime: PREFETCHED_STALE_TIME
    }),
  economy: (params: EconomyTableParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.economy(params),
      queryFn: ({ signal }) => listTankEconomy({ ...params, signal }),
      staleTime: PREFETCHED_STALE_TIME
    })
};
