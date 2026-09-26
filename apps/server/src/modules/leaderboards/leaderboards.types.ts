import type { LeaderboardQuery } from '@otmetki/schemas';

import type { Prisma } from '../../../generated';

export type RankedRow = {
  accountId: bigint | null;
  clanId: bigint | null;
  name: string;
  clanTag: string | null;
  color: string | null;
  value: number | null;
  battles: number;
  delta: number | null;
  total: bigint;
};

export type PlayersSqlInput = {
  query: LeaderboardQuery;
  filter?: Prisma.Sql;
};
