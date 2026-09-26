'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import { startPlusTrial } from '../../../api';

export const useStartTrial = () => {
  const t = useTranslations('plus.teaser');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startPlusTrial,
    onSuccess: (status) => {
      queryClient.setQueryData(QUERY_KEYS.me.billing.status, status);
      toast.success(t('trialStarted', { days: status.plus.trialDays }));
    },
    onError: () => toast.error(t('trialFailed'))
  });
};
