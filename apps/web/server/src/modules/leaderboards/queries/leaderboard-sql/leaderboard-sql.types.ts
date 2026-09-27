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
