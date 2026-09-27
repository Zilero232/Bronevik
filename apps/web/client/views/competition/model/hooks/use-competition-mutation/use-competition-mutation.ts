'use client';

import type { Competition } from '@otmetki/schemas';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useCompetitionsCache } from '@/entities/competition/competition';
import { communityErrorKind } from '@/features/community/api-error';
import { isPlusRequiredError } from '@/shared/api/source';

import type { UseCompetitionMutationInput } from './use-competition-mutation.types';

export const useCompetitionMutation = <TInput>({ mutationFn, successKey }: UseCompetitionMutationInput<TInput>) => {
  const t = useTranslations('competitions');
  const { storeDetail, invalidateLists } = useCompetitionsCache();

  return useMutation({
    mutationFn,
    onSuccess: async (competition: Competition) => {
      storeDetail(competition);
      toast.success(t(`toast.${successKey}`));
      await invalidateLists();
    },
    onError: (error) => toast.error(t(isPlusRequiredError(error) ? 'errors.plus' : `errors.${communityErrorKind(error)}`))
  });
};
