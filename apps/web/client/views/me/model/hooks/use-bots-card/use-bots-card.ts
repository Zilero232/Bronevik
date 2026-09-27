'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getBotLinks, linkBotAccount, unlinkBotAccount } from '../../../api';
import { botRows } from '../../../lib/bot-rows';
import { useMeMutation } from '../use-me-mutation';
import { useMeSection } from '../use-me-section';

export const useBotsCard = () => {
  const t = useTranslations('me.toast');
  const { data, isPending, isError, isFetching, refetch } = useMeSection({ section: 'bots', fetcher: getBotLinks });
  const unlink = useMeMutation({ section: 'bots', mutationFn: unlinkBotAccount, successKey: 'botUnlinked' });

  const link = useMutation({
    mutationFn: linkBotAccount,
    onSuccess: (url) => {
      if (url) {
        window.location.assign(url);
      }
    },
    onError: () => toast.error(t('failed'))
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
