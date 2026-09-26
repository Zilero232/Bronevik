'use client';

import type { PlayerSearchResult } from '@otmetki/schemas';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { isPlusRequiredError } from '@/shared/api/source';
import { addWatchlistPlayer } from '@/features/player/watch-player';

import { useWatchlistCache } from '../use-watchlist-cache';

export const useAddWatchPlayer = () => {
  const t = useTranslations('watchlist.toast');
  const { invalidate } = useWatchlistCache();
  const add = useMutation({
    mutationFn: ({ accountId }: PlayerSearchResult) => addWatchlistPlayer(accountId),
    onSuccess: async (_, { nickname }) => {
      toast.success(t('added', { nickname }));
      await invalidate();
    },
    onError: (error) => toast.error(t(isPlusRequiredError(error) ? 'limit' : 'failed'))
  });

  return {
    isAdding: add.isPending,
    onPick: (player: PlayerSearchResult) => add.mutate(player)
  };
};
