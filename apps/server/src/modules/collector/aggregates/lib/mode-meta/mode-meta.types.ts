import type { PlayMode } from '@otmetki/schemas';

export type ModeSqlRow = {
  tank_id: number;
  battles: number;
  players: number;
  wins: number;
  decided: number;
  avg_damage: number | null;
  avg_xp: number | null;
  avg_frags: number | null;
  survival_rate: number | null;
  mod_battles: number;
  replay_battles: number;
};

export type ToModeRecordInput = {
  row: ModeSqlRow;
  mode: PlayMode;
  windowDays: number;
  computedAt: Date;
};
