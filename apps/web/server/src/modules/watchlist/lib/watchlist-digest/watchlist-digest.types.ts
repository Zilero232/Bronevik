import type { WatchlistDigest } from '@otmetki/schemas';

export type IsDigestDueInput = {
  digest: WatchlistDigest;
  lastDigestAt: Date | null;
  now: Date;
};

type DigestPlayer = {
  nickname: string;
  battles: number;
  wins: number;
  marksGained: number;
};

export type WatchlistDigestSummary = {
  activePlayers: number;
  battles: number;
  marksGained: number;
  top: { nickname: string; battles: number; winRate: number; marksGained: number }[];
};

export type SummarizeDigestInput = {
  players: readonly DigestPlayer[];
  limit: number;
};
