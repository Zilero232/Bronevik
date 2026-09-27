import { queryOptions } from '@tanstack/react-query';

import { getTank } from '@/entities/tank/tank';
import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

import type { TankDetailParams } from './tank-queries.types';

export const tankQueries = {
  detail: (params: TankDetailParams) =>
    queryOptions({
      queryKey: QUERY_KEYS.tanks.detail(params),
      queryFn: ({ signal }) => getTank({ ...params, signal }),
      staleTime: PREFETCHED_STALE_TIME
    })
};
