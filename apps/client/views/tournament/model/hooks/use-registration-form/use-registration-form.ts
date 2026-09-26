'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import type { RegisterTournamentInput, Tournament, WithdrawTournamentInput } from '@/entities/tournament/tournament';

import { chosenAccountId, useCommunityViewer } from '@/features/community/viewer';
import { registerTournament, withdrawTournament } from '../../../api';
import { useClientNow } from '@/shared/lib';

import type { RegistrationFormOutput, RegistrationFormValues } from '../../../lib/registration-form';

import { REGISTRATION_FORM_DEFAULTS, TOURNAMENT_PAGE } from '../../../config';
import { registrationState } from '../../../lib/registration';
import { registrationFormSchema } from '../../../lib/registration-form';
import { useTournamentMutation } from '../use-tournament-mutation';

export const useRegistrationForm = (tournament: Tournament) => {
  const now = useClientNow({ updateInterval: TOURNAMENT_PAGE.nowTickMs });
  const { ownsAccount } = useCommunityViewer();
  const form = useForm<RegistrationFormValues, unknown, RegistrationFormOutput>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: REGISTRATION_FORM_DEFAULTS
  });

  const register = useTournamentMutation({ mutationFn: (input: RegisterTournamentInput) => registerTournament(input), successKey: 'registered' });

  const withdraw = useTournamentMutation({ mutationFn: (input: WithdrawTournamentInput) => withdrawTournament(input), successKey: 'withdrawn' });
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
