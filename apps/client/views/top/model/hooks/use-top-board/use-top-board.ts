'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getLeaderboard } from '@/entities/player/leaderboard';
import { QUERY_KEYS } from '@/shared/constants';

import { TOP_BOARD } from '../../../config';
import { toLeaderboardFilter } from '../../../lib/top-filter';
import { useTopParams } from '../use-top-params';

export const useTopBoard = () => {
  const [params] = useTopParams();
  const filter = toLeaderboardFilter(params);
  const query = useQuery({
    queryKey: QUERY_KEYS.leaderboard(filter),
    queryFn: ({ signal }) => getLeaderboard({ ...filter, signal }),
    placeholderData: keepPreviousData
  });

  return {
    filter,
    query,
    podium: query.isError ? [] : (query.data?.entries.slice(0, TOP_BOARD.podiumSize) ?? []),
    isRefreshing: query.isPlaceholderData
  };
};
