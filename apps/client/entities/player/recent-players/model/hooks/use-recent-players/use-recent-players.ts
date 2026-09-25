'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import type { RecentPlayer } from './use-recent-players.types';

import { RECENT_PLAYERS } from '../../../config';

const EMPTY: RecentPlayer[] = [];

export const useRecentPlayers = () => {
  const { value, set, remove } = useLocalStorage<RecentPlayer[]>(RECENT_PLAYERS.storageKey, EMPTY);

  const players = value ?? EMPTY;

  const remember = (player: Omit<RecentPlayer, 'viewedAt'>) =>
    set(
      [{ ...player, viewedAt: new Date().toISOString() }, ...players.filter(({ accountId }) => accountId !== player.accountId)].slice(
        0,
        RECENT_PLAYERS.limit
      )
    );

  return { players, remember, clear: remove };
};
