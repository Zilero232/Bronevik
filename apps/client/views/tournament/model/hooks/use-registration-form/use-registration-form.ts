'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNow } from 'next-intl';
import { useForm } from 'react-hook-form';

import type { RegisterTournamentInput, Tournament } from '@/shared/api/tournaments';

import { chosenAccountId, useCommunityViewer } from '@/features/community/viewer';
import { registerTournament } from '@/shared/api/tournaments';

import type { RegistrationFormOutput, RegistrationFormValues } from '../../../lib/registration-form';

import { REGISTRATION_FORM_DEFAULTS, TOURNAMENT_PAGE } from '../../../config';
import { registrationState } from '../../../lib/registration';
import { registrationFormSchema } from '../../../lib/registration-form';
import { useTournamentMutation } from '../use-tournament-mutation';

export const useRegistrationForm = (tournament: Tournament) => {
  const now = useNow({ updateInterval: TOURNAMENT_PAGE.nowTickMs });
  const { ownsAccount } = useCommunityViewer();
  const form = useForm<RegistrationFormValues, unknown, RegistrationFormOutput>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: REGISTRATION_FORM_DEFAULTS
  });

  const register = useTournamentMutation({ mutationFn: (input: RegisterTournamentInput) => registerTournament(input), successKey: 'registered' });

  const isRegistered = tournament.participants.some(({ accountId }) => ownsAccount(accountId));

  const onSubmit = form.handleSubmit(({ accountId, teamName }) => {
    const account = chosenAccountId(accountId);
    const team = teamName.trim();

    register.mutate({
      id: tournament.id,
      ...(account === undefined ? {} : { accountId: account }),
      ...(team === '' ? {} : { teamName: team })
    });
  });

  return {
    form,
    state: registrationState({ tournament, now, isRegistered }),
    isPending: register.isPending,
    onSubmit
  };
};
