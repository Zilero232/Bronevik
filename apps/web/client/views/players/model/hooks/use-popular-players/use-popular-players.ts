'use client';

import { useQuery } from '@tanstack/react-query';

import { getPopularPlayers, PLAYERS_REQUEST } from '@/entities/player/profile';
import { QUERY_KEYS } from '@/shared/constants';

export const usePopularPlayers = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.player.popular({ days: PLAYERS_REQUEST.popularDays, limit: PLAYERS_REQUEST.popularLimit }),
    queryFn: ({ signal }) => getPopularPlayers({ signal })
  });

  return {
    query,
    days: query.data?.days ?? PLAYERS_REQUEST.popularDays
  };
};
