'use client';

import type { RecentPeriod } from '@bronevik/schemas';

import { recentPeriodSchema } from '@bronevik/schemas';
import { useState } from 'react';
import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';
import { MOCK_PLAYERS } from '@/shared/mocks';

const LIMIT = 4;

export const useTopPlayers = () => {
  const [period, setPeriod] = useState<RecentPeriod>('30d');

  const random = seededRandom(recentPeriodSchema.options.indexOf(period) + 1);
  const players = sortBy(
    MOCK_PLAYERS.map((player) => ({ player, score: player.wn8 * (0.85 + random() * 0.3) })),
    [({ score }) => score, 'desc']
  )
    .slice(0, LIMIT)
    .map(({ player }) => player);

  return { period, setPeriod, players };
};
