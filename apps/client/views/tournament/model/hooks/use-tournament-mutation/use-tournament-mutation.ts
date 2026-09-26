'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { Tournament } from '@/shared/api/tournaments';

import { communityErrorKind } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseTournamentMutationInput } from './use-tournament-mutation.types';

export const useTournamentMutation = <TInput>({ mutationFn, successKey }: UseTournamentMutationInput<TInput>) => {
  const t = useTranslations('tournaments');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async (tournament: Tournament) => {
      queryClient.setQueryData(QUERY_KEYS.tournaments.detail(tournament.slug), tournament);
      toast.success(t(`toast.${successKey}`));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tournaments.all });
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });
};
