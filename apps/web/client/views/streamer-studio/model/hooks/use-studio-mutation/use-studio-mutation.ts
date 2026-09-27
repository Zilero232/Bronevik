'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { UseStudioMutationInput } from './use-studio-mutation.types';

export const useStudioMutation = <TInput, TOutput>({ mutationFn, queryKey, successKey }: UseStudioMutationInput<TInput, TOutput>) => {
  const t = useTranslations('streamer.studio.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(t(successKey));
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: () => toast.error(t('failed'))
  });
};
