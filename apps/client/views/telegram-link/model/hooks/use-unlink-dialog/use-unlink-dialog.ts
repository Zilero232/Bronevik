'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { unlinkTelegram } from '../../../api';
import { QUERY_KEYS } from '@/shared/constants';

export const useUnlinkDialog = () => {
  const t = useTranslations('telegram.toast');
  const queryClient = useQueryClient();
  const [isOpen, toggleOpen] = useBoolean(false);
  const unlink = useMutation({
    mutationFn: unlinkTelegram,
    onSuccess: async () => {
      toast.success(t('unlinked'));
      toggleOpen(false);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.telegram }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.section('accounts') })
      ]);
    },
    onError: () => toast.error(t('unlinkFailed'))
  });

  return { isOpen, onOpenChange: toggleOpen, onConfirm: () => unlink.mutate(), isPending: unlink.isPending };
};
