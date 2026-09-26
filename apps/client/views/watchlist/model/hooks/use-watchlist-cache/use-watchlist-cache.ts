'use client';

import type { Watchlist, WatchlistSettings } from '@otmetki/schemas';

import { WATCHLIST_PERIODS } from '@otmetki/schemas';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

export const useWatchlistCache = () => {
  const queryClient = useQueryClient();

  const invalidate = () => Promise.all(WATCHLIST_PERIODS.map((period) => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchlist(period) })));

  const applySettings = (settings: WatchlistSettings) =>
    WATCHLIST_PERIODS.forEach((period) =>
      queryClient.setQueryData<Watchlist>(QUERY_KEYS.watchlist(period), (current) => (current ? { ...current, ...settings } : current))
    );

  return { invalidate, applySettings };
};
