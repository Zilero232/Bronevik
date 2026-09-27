import { queryOptions } from '@tanstack/react-query';

import type { LeaderboardFilter } from '@/entities/player/leaderboard';

import { getLeaderboard } from '@/entities/player/leaderboard';
import { QUERY_KEYS } from '@/shared/constants';

export const topQueries = {
  board: (filter: LeaderboardFilter) =>
    queryOptions({
      queryKey: QUERY_KEYS.leaderboard(filter),
      queryFn: ({ signal }) => getLeaderboard({ ...filter, signal })
    })
};
