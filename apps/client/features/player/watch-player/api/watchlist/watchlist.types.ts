import type { WatchlistPeriod } from '@otmetki/schemas';

export type GetWatchlistInput = {
  period: WatchlistPeriod;
  signal?: AbortSignal;
};
