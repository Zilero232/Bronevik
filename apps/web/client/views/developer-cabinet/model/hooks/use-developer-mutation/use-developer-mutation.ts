'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseDeveloperMutationInput } from './use-developer-mutation.types';

export const useDeveloperMutation = <TInput, TOutput>({
  mutationFn,
  invalidates,
  successKey,
  isErrorToasted = true
}: UseDeveloperMutationInput<TInput, TOutput>) => {
  const t = useTranslations('developer.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (successKey) {
        toast.success(t(successKey));
      }

      [QUERY_KEYS.me.developer.overview, ...invalidates].forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));
    },
    onError: () => {
      if (isErrorToasted) {
        toast.error(t('failed'));
      }
    }
  });
};
