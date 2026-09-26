'use client';

import { useRecentPlayers } from '@/entities/player/recent-players';
import { useHydrated } from '@/shared/lib';

export const useRecentList = () => {
  const isHydrated = useHydrated();
  const { players, clear } = useRecentPlayers();

  return {
    players,
    clear,
    isVisible: isHydrated && players.length > 0
  };
};
