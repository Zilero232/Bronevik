'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseMeMutationInput } from './use-me-mutation.types';

export const useMeMutation = <TInput, TOutput>({ section, mutationFn, successKey }: UseMeMutationInput<TInput, TOutput>) => {
  const t = useTranslations('me.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (successKey) {
        toast.success(t(successKey));
      }

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.section(section) });
    },
    onError: () => toast.error(t('failed'))
  });
};
