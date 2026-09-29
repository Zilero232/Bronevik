import type { OfficialNeighborsQuery, OfficialRankHistoryQuery, OfficialRatingField } from '@otmetki/schemas';

import type { RatingAccount, RatingRankField } from '../../lib/lesta';

export type RankedRow = {
  accountId: bigint | null;
  clanId: bigint | null;
  name: string;
  clanTag: string | null;
  color: string | null;
  value: number | null;
  battles: number;
  delta: number | null;
};

export type OfficialNeighborsInput = {
  accountId: bigint;
  query: OfficialNeighborsQuery;
};

export type OfficialHistoryInput = {
  accountId: bigint;
  query: OfficialRankHistoryQuery;
};

export type OfficialPointInput = {
  accountId: bigint;
  type: string;
  field: OfficialRatingField;
  date: number;
};

export type OfficialEntriesInput = {
  rows: readonly RatingAccount[];
  rankField: RatingRankField;
};
