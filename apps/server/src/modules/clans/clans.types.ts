import type { ClanSummaryRow } from './lib';

export type ClanEventsInput = {
  clanId: bigint;
  limit: number;
  offset: number;
};

export type ClanListRow = ClanSummaryRow & {
  avgWn8: number | null;
  avgWinRate: number | null;
  activeMembers7d: number | null;
  eloRating10: number | null;
  strongholdLevel: number | null;
  total: bigint;
};
