import type { RecentPlayer } from '../model/hooks';

export const RECENT_PLAYERS = {
  storageKey: 'otmetki-recent-players',
  limit: 8
} as const;

export const NO_RECENT_PLAYERS: RecentPlayer[] = [];
