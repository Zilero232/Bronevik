'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { topQueries } from '../../../api';
import { TOP_BOARD } from '../../../config';
import { toLeaderboardFilter } from '../../../lib/top-filter';
import { useTopParams } from '../use-top-params';

export const useTopBoard = () => {
  const [params] = useTopParams();
  const filter = toLeaderboardFilter(params);
  const query = useQuery({ ...topQueries.board(filter), placeholderData: keepPreviousData });

  const { data: board, isError, isPending, isPlaceholderData } = query;

  return {
    filter,
    query,
    podium: isError ? [] : (board?.entries.slice(0, TOP_BOARD.podiumSize) ?? []),
    isLoading: isPending,
    isRefreshing: isPlaceholderData
  };
};
