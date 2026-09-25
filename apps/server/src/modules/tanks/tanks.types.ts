import type { TankDetailQuery, TankServerStatsQuery, TankTrendQuery, TopPlayersQuery } from '@bronevik/schemas';

export type TankStatsListInput = TankServerStatsQuery;

export type TopPlayersInput = {
  tankId: number;
  query: TopPlayersQuery;
};

export type TankDetailInput = {
  idOrSlug: string;
  query: TankDetailQuery;
};

export type TankTrendInput = {
  tankId: number;
  query: TankTrendQuery;
};

export type TrendRow = {
  day: string;
  battles: number;
  wins: number;
  damage: number;
  players: number;
};
