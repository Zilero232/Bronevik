'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { unlinkTelegram } from '@/shared/api/telegram';
import { QUERY_KEYS } from '@/shared/constants';

export const useUnlinkTelegram = () => {
  const t = useTranslations('telegram.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlinkTelegram,
    onSuccess: async () => {
      toast.success(t('unlinked'));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.telegram }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.section('accounts') })
      ]);
    },
    onError: () => toast.error(t('unlinkFailed'))
  });
};
