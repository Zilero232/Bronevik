'use client';

import type { WatchlistPeriod } from '@otmetki/schemas';

import { WATCHLIST, WATCHLIST_PERIODS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { getWatchlist } from '@/features/player/watch-player';
import { QUERY_KEYS } from '@/shared/constants';

import { isWatchlistFull, watchlistSummary } from '../../../lib/watchlist-summary';

export const useWatchlistPage = () => {
  const [period, setPeriod] = useQueryState(
    'period',
    parseAsStringLiteral(WATCHLIST_PERIODS).withDefault(WATCHLIST.defaultPeriod).withOptions({ history: 'replace' })
  );

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.watchlist(period),
    queryFn: ({ signal }) => getWatchlist({ period, signal })
  });

  const players = data?.players ?? [];

  return {
    period,
    watchlist: data ?? null,
    players,
    summary: watchlistSummary(players),
    watchedIds: players.map(({ accountId }) => accountId),
    isFull: data ? isWatchlistFull({ used: players.length, limit: data.limit }) : false,
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    retry: () => void refetch(),
    onPeriodChange: (next: WatchlistPeriod) => void setPeriod(next)
  };
};
