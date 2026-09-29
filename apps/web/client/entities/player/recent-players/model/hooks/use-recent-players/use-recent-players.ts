'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import type { RecentPlayer } from './use-recent-players.types';

import { NO_RECENT_PLAYERS, RECENT_PLAYERS } from '../../../config';

export const useRecentPlayers = () => {
  const { value, set, remove } = useLocalStorage<RecentPlayer[]>(RECENT_PLAYERS.storageKey, NO_RECENT_PLAYERS);

  const players = value ?? NO_RECENT_PLAYERS;

  const remember = (player: Omit<RecentPlayer, 'viewedAt'>) =>
    set(
      [{ ...player, viewedAt: new Date().toISOString() }, ...players.filter(({ accountId }) => accountId !== player.accountId)].slice(
        0,
        RECENT_PLAYERS.limit
      )
    );

  return { players, remember, clear: remove };
};
