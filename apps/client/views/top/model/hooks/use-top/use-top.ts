'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getLeaderboard } from '@/shared/api/leaderboards';
import { QUERY_KEYS } from '@/shared/constants';

import type { TopFilterState } from '../../../lib/top-filter';

import { toLeaderboardFilter } from '../../../lib/top-filter';

const INITIAL: TopFilterState = { scope: 'players', metric: 'wn8', period: '30d', tier: 'all', type: 'all', tank: null };

export const useTop = () => {
  const [state, setState] = useState<TopFilterState>(INITIAL);

  const filter = toLeaderboardFilter(state);

  const {
    data: board,
    isPending,
    isError,
    isPlaceholderData
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
    update: (patch: Partial<TopFilterState>) => setState((current) => ({ ...current, ...patch }))
  };
};
