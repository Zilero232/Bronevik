import type { ModeMetaQuery, MyModeStatsQuery, PlayMode } from '@otmetki/schemas';

import type { ModeTankAggregate } from '../../../generated';

export type ModeMetaInput = {
  mode: PlayMode;
  query: ModeMetaQuery;
};

export type MyModeStatsInput = {
  userId: string;
  query: MyModeStatsQuery;
};

export type MyModeSqlRow = {
  mode_types: string;
  tank_id: number;
  battles: number;
  wins: number;
  decided: number;
  damage: number;
  xp: number;
  frags: number;
  survived: number;
  survival_known: number;
  last_battle_at: Date;
};

export type ToModeTanksInput = {
  rows: ModeTankAggregate[];
  minBattles: number;
};
