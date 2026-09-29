import type { LeaderboardQuery, RatingPeriod } from '@otmetki/schemas';

import type { Prisma } from '../../../../../generated';

export type LeaderboardSqlInput = {
  query: LeaderboardQuery;
  minBattles: number;
};

export type PlayersSqlInput = LeaderboardSqlInput & {
  filter?: Prisma.Sql;
};

export type RisingStarsSqlInput = LeaderboardSqlInput & {
  period: RatingPeriod;
};

export type LeaderboardSql = {
  page: Prisma.Sql;
  total: Prisma.Sql;
};

export type LeaderboardTotalRow = {
  total: bigint;
};
