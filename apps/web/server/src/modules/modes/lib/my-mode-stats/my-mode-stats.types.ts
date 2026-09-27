import type { PlayMode, VehicleSummary } from '@otmetki/schemas';

export type MyModeRow = {
  mode: PlayMode;
  tankId: number;
  battles: number;
  wins: number;
  decided: number;
  damage: number;
  xp: number;
  frags: number;
  survived: number;
  survivalKnown: number;
  lastBattleAt: Date;
};

export type FoldModeStatsInput = {
  rows: readonly MyModeRow[];
  vehicles: ReadonlyMap<number, VehicleSummary>;
  tanksLimit: number;
};
