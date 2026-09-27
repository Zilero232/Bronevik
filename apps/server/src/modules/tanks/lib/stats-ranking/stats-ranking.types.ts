import type { TankServerStatsQuery, TankServerStatsRow, TankServerStatsSortField } from '@otmetki/schemas';

export type StatsSampleFloorInput = {
  sort: TankServerStatsSortField;
  minBattles: number;
};

export type StatsSampleFloor = {
  battles: number;
  players: number;
};

export type StatsRankValueInput = {
  row: TankServerStatsRow;
  sort: TankServerStatsSortField;
  order: TankServerStatsQuery['order'];
};
