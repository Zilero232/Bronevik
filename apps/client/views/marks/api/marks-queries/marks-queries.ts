import { infiniteQueryOptions } from '@tanstack/react-query';

import { listMoe } from '@/entities/player/marks';
import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

import type { MoeFeedInput } from './marks-queries.types';

import { nextOffset } from '../../lib/moe-pages';

export const marksQueries = {
  feed: (params: MoeFeedInput) =>
    infiniteQueryOptions({
      queryKey: QUERY_KEYS.marks.feed(params),
      queryFn: ({ signal, pageParam }) => listMoe({ ...params, offset: pageParam, signal }),
      initialPageParam: 0,
      getNextPageParam: nextOffset,
      staleTime: PREFETCHED_STALE_TIME
    })
};
