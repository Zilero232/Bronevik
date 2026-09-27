import { queryOptions } from '@tanstack/react-query';

import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

import type { PlayerWrappedInput } from '../wrapped';

import { getPlayer } from '../players';
import { getPlayerWrapped } from '../wrapped';

export const playerQueries = {
  profile: (idOrNick: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.player.profile(idOrNick),
      queryFn: ({ signal }) => getPlayer({ idOrNick, signal }),
      staleTime: PREFETCHED_STALE_TIME
    }),
  wrapped: ({ accountId, year }: Omit<PlayerWrappedInput, 'signal'>) =>
    queryOptions({
      queryKey: QUERY_KEYS.player.section({ accountId, section: 'wrapped', params: { year } }),
      queryFn: ({ signal }) => getPlayerWrapped({ accountId, year, signal }),
      staleTime: PREFETCHED_STALE_TIME
    })
};
