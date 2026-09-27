import type { WatchlistPlayer } from '@otmetki/schemas';

import { isPlusDigest } from '@otmetki/schemas';
import { sumBy } from 'remeda';

import type { DigestLockInput, WatchlistFullInput, WatchlistSummary } from './watchlist-summary.types';

export const watchlistSummary = (players: readonly WatchlistPlayer[]): WatchlistSummary => ({
  watched: players.length,
  active: players.filter(({ battles }) => battles > 0).length,
  battles: sumBy(players, ({ battles }) => battles),
  marks: sumBy(players, ({ marksGained }) => marksGained)
});

export const isDigestLocked = ({ digest, isPlus }: DigestLockInput): boolean => !isPlus && isPlusDigest(digest);

export const isWatchlistFull = ({ used, limit }: WatchlistFullInput): boolean => used >= limit;
