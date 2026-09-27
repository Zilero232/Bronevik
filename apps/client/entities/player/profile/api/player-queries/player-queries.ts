import { queryOptions } from '@tanstack/react-query';

import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

import { getPlayer } from '../players';

export const playerQueries = {
  profile: (idOrNick: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.player.profile(idOrNick),
      queryFn: ({ signal }) => getPlayer({ idOrNick, signal }),
      staleTime: PREFETCHED_STALE_TIME
    })
};
