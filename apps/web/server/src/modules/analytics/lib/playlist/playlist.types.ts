import type { PlaylistReason } from '@otmetki/schemas';

export type PlaylistCandidate = {
  tankId: number;
  tier: number;
  battles: number;
  winRate: number | null;
  moePercent: number | null;
  nextMarkPercent: number | null;
  daysSinceBattle: number | null;
  isFirstWinAvailable: boolean;
  isMission: boolean;
};

export type BuildPlaylistInput = {
  candidates: readonly PlaylistCandidate[];
  size: number;
  reasons: readonly PlaylistReason[];
  seed: number;
};

export type PlaylistPick = {
  candidate: PlaylistCandidate;
  reasons: PlaylistReason[];
};
