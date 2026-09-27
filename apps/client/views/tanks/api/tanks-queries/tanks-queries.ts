import { queryOptions } from '@tanstack/react-query';

import { listTankStats } from '@/entities/tank/tank';
import { QUERY_KEYS } from '@/shared/constants';

import type { TankStatsParams } from './tanks-queries.types';

export const tanksQueries = {
  stats: (params: TankStatsParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.stats(params),
      queryFn: ({ signal }) => listTankStats({ ...params, signal })
    })
};
