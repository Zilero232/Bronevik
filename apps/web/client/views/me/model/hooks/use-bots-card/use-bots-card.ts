'use client';

import { useMutation } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getBotLinks, linkBotAccount, unlinkBotAccount } from '../../../api';
import { botRows } from '../../../lib/bot-rows';
import { useMeSection } from '../use-me-section';

export const useBotsCard = () => {
  const { data, isPending, isError, isFetching, refetch } = useMeSection({ section: 'bots', fetcher: getBotLinks });
  const unlink = useMutation({
    mutationFn: unlinkBotAccount,
    meta: { successKey: 'me.toast.botUnlinked', errorKey: 'me.toast.failed', invalidates: [QUERY_KEYS.me.section('bots')] }
  });

  const link = useMutation({
    mutationFn: linkBotAccount,
    onSuccess: (url) => {
      if (url) {
        window.location.assign(url);
      }
    },
    meta: { errorKey: 'me.toast.failed' }
  });

  return {
    rows: data ? botRows(data) : [],
    isPending,
    isError,
    isRetrying: isFetching,
    isBusy: link.isPending || unlink.isPending,
    onRetry: () => void refetch(),
    onLink: link.mutate,
    onUnlink: unlink.mutate
  };
};
