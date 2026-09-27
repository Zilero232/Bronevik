'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { communityErrorKind } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import type { OrderMutation } from './use-order-mutation.types';

export const useOrderMutation = () => {
  const t = useTranslations('coaching');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: OrderMutation) => action(),
    onSuccess: async () => {
      toast.success(t('orders.toast.updated'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.coaching.all });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });
};
