'use client';

import { useQuery } from '@tanstack/react-query';

import { getPopularPlayers, PLAYERS_REQUEST } from '@/shared/api/players';
import { QUERY_KEYS } from '@/shared/constants';

export const usePopularPlayers = () =>
  useQuery({
    queryKey: QUERY_KEYS.player.popular({ days: PLAYERS_REQUEST.popularDays, limit: PLAYERS_REQUEST.popularLimit }),
    queryFn: ({ signal }) => getPopularPlayers({ signal })
  });
