'use client';

import type { WatchlistDigest } from '@otmetki/schemas';

import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { usePlus } from '@/features/plus/plus-gate';
import { isPlusRequiredError } from '@/shared/api/source';
import { updateWatchlistSettings } from '../../../api';

import type { UseWatchlistDigestInput } from './use-watchlist-digest.types';

import { WATCHLIST_PAGE } from '../../../config';
import { isDigestLocked } from '../../../lib/watchlist-summary';
import { useWatchlistCache } from '../use-watchlist-cache';

export const useWatchlistDigest = ({ digest }: UseWatchlistDigestInput) => {
  const t = useTranslations('watchlist.toast');
  const { isPlus } = usePlus();
  const [isLockedPicked, setLockedPicked] = useBoolean(false);
  const { applySettings } = useWatchlistCache();
  const update = useMutation({
    mutationFn: updateWatchlistSettings,
    onSuccess: (settings) => {
      applySettings(settings);
      toast.success(t('digestSaved'));
    },
    onError: (error) => {
      setLockedPicked(isPlusRequiredError(error));
      toast.error(t(isPlusRequiredError(error) ? 'digestPlus' : 'failed'));
    }
  });

  const options = WATCHLIST_PAGE.digestOrder.map((value) => ({ value, isLocked: isDigestLocked({ digest: value, isPlus }) }));

  const onChange = (next: WatchlistDigest) => {
    if (isDigestLocked({ digest: next, isPlus })) {
      setLockedPicked(true);

      return;
    }

    setLockedPicked(false);
    update.mutate(next);
  };

  return {
    value: update.isPending ? update.variables : digest,
    options,
    isLockedPicked,
    isSaving: update.isPending,
    onChange
  };
};
