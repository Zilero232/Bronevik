import type { WatchlistDigest } from './watchlist.types';

import { WATCHLIST } from './watchlist.constants';

export const isPlusDigest = (digest: WatchlistDigest): boolean => WATCHLIST.plusDigests.some((plus) => plus === digest);
