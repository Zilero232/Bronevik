'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { redeemPromo } from '@/shared/api/billing';
import { QUERY_KEYS } from '@/shared/constants';

export const useRedeemPromo = () => {
  const t = useTranslations('billing.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: redeemPromo,
    onSuccess: (status) => {
      queryClient.setQueryData(QUERY_KEYS.me.billing.status, status);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.billing.history });
      toast.success(t('promoRedeemed'));
    }
  });
};
