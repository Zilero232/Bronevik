import type { WatchlistPlayer } from '@otmetki/schemas';

import { isPlusDigest, WATCHLIST_DIGESTS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { isDigestLocked, isWatchlistFull, watchlistSummary } from '../watchlist-summary';

const player = (patch: Partial<WatchlistPlayer>): WatchlistPlayer => ({
  followId: '00000000-0000-4000-8000-000000000001',
  accountId: 1,
  nickname: 'tanker',
  clanTag: null,
  watchedSince: '2026-09-01T00:00:00.000Z',
  lastBattleAt: null,
  battles: 0,
  wins: 0,
  winRate: null,
  avgDamage: null,
  marksGained: 0,
  wn8: null,
  ...patch
});

describe('watchlistSummary', () => {
  it('adds up battles and marks and counts only players who played as active', () => {
    const players = [
      player({ battles: 3, marksGained: 1 }),
      player({ accountId: 2, battles: 0 }),
      player({ accountId: 3, battles: 5, marksGained: 2 })
    ];

    expect(watchlistSummary(players)).toEqual({ watched: players.length, active: 2, battles: 8, marks: 3 });
  });

  it('is all zeros for an empty list', () => {
    expect(watchlistSummary([])).toEqual({ watched: 0, active: 0, battles: 0, marks: 0 });
  });
});

describe('isDigestLocked', () => {
  it('locks exactly the Plus digests for a free user', () => {
    WATCHLIST_DIGESTS.forEach((digest) => {
      expect(isDigestLocked({ digest, isPlus: false })).toBe(isPlusDigest(digest));
    });
  });

  it('locks nothing for a Plus user', () => {
    WATCHLIST_DIGESTS.forEach((digest) => {
      expect(isDigestLocked({ digest, isPlus: true })).toBe(false);
    });
  });
});

describe('isWatchlistFull', () => {
  it('is full once the limit is reached', () => {
    expect(isWatchlistFull({ used: 9, limit: 10 })).toBe(false);
    expect(isWatchlistFull({ used: 10, limit: 10 })).toBe(true);
    expect(isWatchlistFull({ used: 11, limit: 10 })).toBe(true);
  });
});
