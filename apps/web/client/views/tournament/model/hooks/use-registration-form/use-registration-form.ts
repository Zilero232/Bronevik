'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import type { RegisterTournamentInput, Tournament, WithdrawTournamentInput } from '@/entities/tournament/tournament';

import { chosenAccountId, useCommunityViewer } from '@/entities/auth/session';
import { communityErrorKey } from '@/features/community/api-error';
import { QUERY_KEYS } from '@/shared/constants';
import { useClientNow } from '@/shared/lib';

import type { RegistrationFormOutput, RegistrationFormValues } from '../../../lib/registration-form';

import { registerTournament, withdrawTournament } from '../../../api';
import { REGISTRATION_FORM_DEFAULTS, TOURNAMENT_PAGE } from '../../../config';
import { registrationState } from '../../../lib/registration';
import { registrationFormSchema } from '../../../lib/registration-form';

export const useRegistrationForm = (tournament: Tournament) => {
  const now = useClientNow({ updateInterval: TOURNAMENT_PAGE.nowTickMs });
  const { ownsAccount } = useCommunityViewer();
  const form = useForm<RegistrationFormValues, unknown, RegistrationFormOutput>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: REGISTRATION_FORM_DEFAULTS
  });

  const register = useMutation({
    mutationFn: (input: RegisterTournamentInput) => registerTournament(input),
    meta: { successKey: 'tournaments.toast.registered', errorKey: communityErrorKey('tournaments'), invalidates: [QUERY_KEYS.tournaments.all] }
  });

  const withdraw = useMutation({
    mutationFn: (input: WithdrawTournamentInput) => withdrawTournament(input),
    meta: { successKey: 'tournaments.toast.withdrawn', errorKey: communityErrorKey('tournaments'), invalidates: [QUERY_KEYS.tournaments.all] }
  });

  const entry = tournament.participants.find(({ accountId }) => ownsAccount(accountId));
  const isRegistered = entry !== undefined;

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
    isPending: register.isPending || withdraw.isPending,
    canWithdraw: isRegistered && tournament.status === 'registration',
    onSubmit,
    onWithdraw: () => {
      if (entry) {
        withdraw.mutate({ id: tournament.id, accountId: entry.accountId });
      }
    }
  };
};
