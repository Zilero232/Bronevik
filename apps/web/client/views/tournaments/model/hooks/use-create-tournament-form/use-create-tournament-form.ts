'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { communityErrorKind } from '@/features/community/api-error';
import { useFormDialog } from '@/features/community/form-dialog';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';

import { createTournament } from '../../../api';
import { TOURNAMENT_FORM_DEFAULTS } from '../../../config';
import { toCreateTournament, tournamentFormSchema } from '../../../lib/tournament-form';

export const useCreateTournamentForm = () => {
  const t = useTranslations('tournaments');
  const queryClient = useQueryClient();

  return useFormDialog({
    schema: tournamentFormSchema,
    defaults: TOURNAMENT_FORM_DEFAULTS,
    mutationFn: (values) => createTournament({ ...toCreateTournament(values), openRegistration: true }),
    onSuccess: (tournament) => queryClient.setQueryData(QUERY_KEYS.tournaments.detail(tournament.slug), tournament),
    successMessage: t('toast.created'),
    errorMessage: (error) => t(`errors.${communityErrorKind(error)}`),
    invalidate: QUERY_KEYS.tournaments.lists,
    redirect: (tournament) => ROUTES.tournaments.detail(tournament.slug)
  });
};
