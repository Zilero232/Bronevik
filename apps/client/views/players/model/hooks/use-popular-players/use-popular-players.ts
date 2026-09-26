'use client';

import { useQuery } from '@tanstack/react-query';

import { getPopularPlayers, PLAYERS_REQUEST } from '@/shared/api/players';
import { QUERY_KEYS } from '@/shared/constants';

export const usePopularPlayers = () => {
  const { data, isPending, isError, isRefetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.player.popular({ days: PLAYERS_REQUEST.popularDays, limit: PLAYERS_REQUEST.popularLimit }),
    queryFn: ({ signal }) => getPopularPlayers({ signal })
  });

  return {
    items: data?.items ?? [],
    days: data?.days ?? PLAYERS_REQUEST.popularDays,
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
