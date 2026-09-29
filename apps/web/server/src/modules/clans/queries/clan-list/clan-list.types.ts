import type { ClanListQuery } from '@otmetki/schemas';

import type { ClanSummaryRow } from '../../mappers';

export type ClanListSqlInput = ClanListQuery;

export type ClanListRow = ClanSummaryRow & {
  avgWn8: number | null;
  avgWinRate: number | null;
  activeMembers7d: number | null;
  eloRating10: number | null;
  strongholdLevel: number | null;
  total: bigint;
};
