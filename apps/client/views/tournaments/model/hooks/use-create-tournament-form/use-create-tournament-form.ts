'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { CreateTournament } from '@/shared/api/tournaments';

import { communityErrorKind } from '@/features/community/api-error';
import { createTournament, openTournament } from '@/shared/api/tournaments';
import { QUERY_KEYS, ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';

import type { TournamentFormOutput, TournamentFormValues } from '../../../lib/tournament-form';

import { TOURNAMENT_FORM_DEFAULTS } from '../../../config';
import { toCreateTournament, tournamentFormSchema } from '../../../lib/tournament-form';

export const useCreateTournamentForm = () => {
  const t = useTranslations('tournaments');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useBoolean(false);
  const form = useForm<TournamentFormValues, unknown, TournamentFormOutput>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: TOURNAMENT_FORM_DEFAULTS,
    mode: 'onTouched'
  });

  const create = useMutation({
    mutationFn: async (body: CreateTournament) => openTournament((await createTournament(body)).id),
    onSuccess: async (tournament) => {
      toast.success(t('toast.created'));
      queryClient.setQueryData(QUERY_KEYS.tournaments.detail(tournament.slug), tournament);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tournaments.all });
      router.push(ROUTES.tournament(tournament.slug));
    },
    onError: (error) => toast.error(t(`errors.${communityErrorKind(error)}`))
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      form.reset(TOURNAMENT_FORM_DEFAULTS);
    }
  };

  const onSubmit = form.handleSubmit((values) => create.mutate(toCreateTournament(values), { onSuccess: () => onOpenChange(false) }));

  return { form, isOpen, isPending: create.isPending, onOpenChange, onSubmit };
};
