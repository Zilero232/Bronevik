'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getLeaderboard } from '@/shared/api/leaderboards';
import { QUERY_KEYS } from '@/shared/constants';

import type { TopFilterState } from '../../../lib/top-filter';

import { TOP_BOARD } from '../../../config';
import { toLeaderboardFilter } from '../../../lib/top-filter';

export const useTop = () => {
  const [state, setState] = useState<TopFilterState>(TOP_BOARD.initialFilter);

  const filter = toLeaderboardFilter(state);

  const {
    data: board,
    isPending,
    isError,
    isFetching,
    isPlaceholderData,
    refetch
  } = useQuery({
    queryKey: QUERY_KEYS.leaderboard(filter),
    queryFn: ({ signal }) => getLeaderboard({ ...filter, signal }),
    placeholderData: keepPreviousData
  });

  return {
    state,
    filter,
    board,
    isPending,
    isError,
    isRefreshing: isPlaceholderData,
    isRetrying: isFetching,
    retry: () => void refetch(),
    update: (patch: Partial<TopFilterState>) => setState((current) => ({ ...current, ...patch }))
  };
};
