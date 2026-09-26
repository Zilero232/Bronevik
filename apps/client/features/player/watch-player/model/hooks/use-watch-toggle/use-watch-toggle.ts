'use client';

import { WATCHLIST, WATCHLIST_PERIODS } from '@otmetki/schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { isPlusRequiredError } from '@/shared/api/source';
import { addWatchlistPlayer, getWatchlist, removeWatchlistPlayer } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

export const useWatchToggle = (accountId: number) => {
  const t = useTranslations('watchlist.button');
  const queryClient = useQueryClient();
  const { data: session } = useAuthSession();
  const { data } = useQuery({
    queryKey: QUERY_KEYS.watchlist(WATCHLIST.defaultPeriod),
    queryFn: ({ signal }) => getWatchlist({ period: WATCHLIST.defaultPeriod, signal }),
    enabled: Boolean(session)
  });

  const isWatched = data?.players.some((player) => player.accountId === accountId) ?? false;

  const toggle = useMutation({
    mutationFn: async () => {
      await (isWatched ? removeWatchlistPlayer(accountId) : addWatchlistPlayer(accountId));
    },
    onSuccess: async () => {
      toast.success(isWatched ? t('removed') : t('added'));
      await Promise.all(WATCHLIST_PERIODS.map((period) => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchlist(period) })));
    },
    onError: (error) => toast.error(isPlusRequiredError(error) ? t('limit') : t('failed'))
  });

  return {
    isSignedIn: Boolean(session),
    isWatched,
    isPending: toggle.isPending,
    onToggle: () => toggle.mutate()
  };
};
