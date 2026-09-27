import type { WatchlistDigest } from '@otmetki/schemas';

export type WatchlistSummary = {
  watched: number;
  active: number;
  battles: number;
  marks: number;
};

export type DigestLockInput = {
  digest: WatchlistDigest;
  isPlus: boolean;
};

export type WatchlistFullInput = {
  used: number;
  limit: number;
};
