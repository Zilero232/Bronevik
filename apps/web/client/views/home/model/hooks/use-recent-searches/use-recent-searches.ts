'use client';

import { useRecentPlayers } from '@/entities/player/recent-players';
import { useHydrated } from '@/shared/lib';

import { HOME } from '../../../config';

export const useRecentSearches = () => {
  const isHydrated = useHydrated();
  const { players } = useRecentPlayers();

  return isHydrated ? players.slice(0, HOME.recent.limit) : [];
};
