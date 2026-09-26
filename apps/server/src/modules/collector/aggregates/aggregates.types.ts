import type { ExpectedValuesTable, TankReferenceTable, TankTiers } from '@otmetki/ratings';

export type ReferenceTables = {
  expected: ExpectedValuesTable;
  tiers: TankTiers;
  references: TankReferenceTable;
};

export type CachedTables = {
  tables: ReferenceTables;
  loadedAt: number;
};

export type PercentileRow = {
  tank_id: number;
  players: number;
  damage: number[];
  win_rate: number[];
  frags: number[];
  spotted: number[];
  defence: number[];
};

export type ComputeTankUsageInput = {
  tankId: number;
  since: Date;
  battleTypes: string[];
  gameVersion: string;
};

export type TankRanksInput = {
  tankId: number;
  accountIds: bigint[];
};

export type BuildRankRow = {
  account_id: bigint;
  rank: number;
};
