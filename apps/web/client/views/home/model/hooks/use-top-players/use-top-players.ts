'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getLeaderboard } from '@/entities/player/leaderboard';
import { QUERY_KEYS } from '@/shared/constants';

import type { TopPlayersMetric } from './use-top-players.types';

import { HOME } from '../../../config';

export const useTopPlayers = () => {
  const [metric, setMetric] = useState<TopPlayersMetric>(HOME.topPlayers.metrics[0]);

  const filter = { scope: 'players', metric, period: HOME.period.rating, limit: HOME.topPlayers.limit } as const;

  const query = useQuery({
    queryKey: QUERY_KEYS.leaderboard(filter),
    queryFn: ({ signal }) => getLeaderboard({ ...filter, signal }),
    placeholderData: keepPreviousData,
    select: ({ entries }) => ({ podium: entries.slice(0, HOME.topPlayers.podium), rest: entries.slice(HOME.topPlayers.podium) })
  });

  return { metric, setMetric, query };
};
