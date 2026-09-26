'use client';

import type { WatchlistPlayer } from '@otmetki/schemas';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { removeWatchlistPlayer } from '@/features/player/watch-player';

import { useWatchlistCache } from '../use-watchlist-cache';
import { useWatchlistColumns } from '../use-watchlist-columns';

export const useWatchlistTable = () => {
  const t = useTranslations('watchlist.toast');
  const { invalidate } = useWatchlistCache();
  const remove = useMutation({
    mutationFn: ({ accountId }: WatchlistPlayer) => removeWatchlistPlayer(accountId),
    onSuccess: async () => {
      toast.success(t('removed'));
      await invalidate();
    },
    onError: () => toast.error(t('failed'))
  });

  const columns = useWatchlistColumns({ isRemoving: remove.isPending, onRemove: (player) => remove.mutate(player) });

  return { columns };
};
