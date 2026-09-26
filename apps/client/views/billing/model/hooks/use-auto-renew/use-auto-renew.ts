'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import { cancelAutoRenew, resumeAutoRenew } from '../../../api';

export const useAutoRenew = () => {
  const t = useTranslations('billing.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isEnabled: boolean) => (isEnabled ? resumeAutoRenew() : cancelAutoRenew()),
    onSuccess: (status, isEnabled) => {
      queryClient.setQueryData(QUERY_KEYS.me.billing.status, status);
      toast.success(t(isEnabled ? 'resumed' : 'canceled'));
    },
    onError: () => toast.error(t('failed'))
  });
};
