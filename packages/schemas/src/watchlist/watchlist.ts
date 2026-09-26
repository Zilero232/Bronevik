import type { WatchlistDigest } from './watchlist.types';

import { WATCHLIST } from './watchlist.constants';

const PLUS_DIGESTS: ReadonlySet<WatchlistDigest> = new Set(WATCHLIST.plusDigests);

export const isPlusDigest = (digest: WatchlistDigest): boolean => PLUS_DIGESTS.has(digest);
