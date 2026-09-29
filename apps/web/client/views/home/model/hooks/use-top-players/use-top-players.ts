'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getLeaderboard } from '@/entities/player/leaderboard';
import { QUERY_KEYS } from '@/shared/constants';
import { toneOfTier } from '@/shared/lib';

import type { TopPlayersMetric } from './use-top-players.types';

import { HOME } from '../../../config';

export const useTopPlayers = () => {
  const tc = useTranslations('home.columns');
  const [metric, setMetric] = useState<TopPlayersMetric>(HOME.topPlayers.metrics[0]);

  const filter = { scope: 'players', metric, period: HOME.period.rating, limit: HOME.topPlayers.limit } as const;

  const query = useQuery({
    queryKey: QUERY_KEYS.leaderboard(filter),
    queryFn: ({ signal }) => getLeaderboard({ ...filter, signal }),
    placeholderData: keepPreviousData,
    select: ({ entries }) => ({
      podium: entries.slice(0, HOME.topPlayers.podium).map((entry) => ({
        entry,
        name: entry.clanTag ? `${entry.name} [${entry.clanTag}]` : entry.name,
        tone: entry.tier ? toneOfTier(entry.tier) : null
      })),
      rest: entries.slice(HOME.topPlayers.podium)
    })
  });

  return {
    metric,
    metricLabel: tc(metric),
    metricOptions: HOME.topPlayers.metrics.map((value) => ({ value, label: tc(value) })),
    setMetric,
    query
  };
};
