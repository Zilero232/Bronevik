import type { Replay, ReplayPlayer } from '@/entities/replay/replay';

export type TeamSplit = {
  recorderTeam: number;
  allies: ReplayPlayer[];
  enemies: ReplayPlayer[];
};

export type TeamTotals = {
  players: number;
  alive: number;
  damageDealt: number;
  frags: number;
  xp: number;
};

export type SplitTeamsInput = Pick<Replay, 'owner' | 'players'>;
