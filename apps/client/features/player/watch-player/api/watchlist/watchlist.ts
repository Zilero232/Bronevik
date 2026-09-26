import type { Watchlist } from '@otmetki/schemas';
import type { GetWatchlistInput } from './watchlist.types';
import { watchlistControllerAdd, watchlistControllerList, watchlistControllerRemove } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getWatchlist = ({ period, signal }: GetWatchlistInput): Promise<Watchlist> =>
  fromSdk(() => watchlistControllerList({ ...SESSION_REQUEST, query: { period }, signal }));

export const addWatchlistPlayer = (accountId: number): Promise<Watchlist> =>
  fromSdk(() => watchlistControllerAdd({ ...SESSION_REQUEST, body: { accountId } }));

export const removeWatchlistPlayer = async (accountId: number): Promise<void> => {
  await fromSdk(() => watchlistControllerRemove({ ...SESSION_REQUEST, path: { accountId } }));
};
