import type { z } from 'zod';

import type {
  addWatchlistPlayerSchema,
  updateWatchlistSettingsSchema,
  watchlistDigestSchema,
  watchlistPeriodSchema,
  watchlistPlayerSchema,
  watchlistQuerySchema,
  watchlistSchema,
  watchlistSettingsSchema
} from './watchlist.schemas';

export type WatchlistDigest = z.infer<typeof watchlistDigestSchema>;
export type WatchlistPeriod = z.infer<typeof watchlistPeriodSchema>;
export type WatchlistQuery = z.infer<typeof watchlistQuerySchema>;
export type WatchlistPlayer = z.infer<typeof watchlistPlayerSchema>;
export type Watchlist = z.infer<typeof watchlistSchema>;
export type AddWatchlistPlayerInput = z.infer<typeof addWatchlistPlayerSchema>;
export type UpdateWatchlistSettingsInput = z.infer<typeof updateWatchlistSettingsSchema>;
export type WatchlistSettings = z.infer<typeof watchlistSettingsSchema>;
