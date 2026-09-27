import { queryOptions } from '@tanstack/react-query';

import { getClan } from '@/entities/clan/clan';
import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

export const clanQueries = {
  page: (tag: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.clans.page(tag),
      queryFn: ({ signal }) => getClan({ idOrTag: tag, signal }),
      staleTime: PREFETCHED_STALE_TIME
    })
};
