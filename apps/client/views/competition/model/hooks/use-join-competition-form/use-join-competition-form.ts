'use client';

import type { Competition } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { parseAsString, useQueryState } from 'nuqs';
import { useForm, useWatch } from 'react-hook-form';

import type { JoinCompetitionRequest } from '@/entities/competition/competition';

import { useCommunityViewer } from '@/features/community/viewer';

import type { JoinFormOutput, JoinFormValues } from '../../../lib/join-form';

import { joinCompetition, leaveCompetition } from '../../../api';
import { JOIN_FORM, JOIN_FORM_DEFAULTS } from '../../../config';
import { chosenAccount, joinFormSchema, joinState, openTeams, toJoinInput } from '../../../lib/join-form';
import { useCompetitionMutation } from '../use-competition-mutation';

export const useJoinCompetitionForm = (competition: Competition) => {
  const [code] = useQueryState('code', parseAsString);
  const { accounts } = useCommunityViewer();
  const form = useForm<JoinFormValues, unknown, JoinFormOutput>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: JOIN_FORM_DEFAULTS
  });

  const [accountValue, teamId] = useWatch({ control: form.control, name: ['accountId', 'teamId'] });
  const join = useCompetitionMutation({ mutationFn: (input: JoinCompetitionRequest) => joinCompetition(input), successKey: 'joined' });
  const leave = useCompetitionMutation({ mutationFn: (id: string) => leaveCompetition(id), successKey: 'left' });

  const accountIds = accounts.map(({ accountId }) => accountId);
  const selectedAccount = chosenAccount({ value: accountValue, accountIds });

  const onSubmit = form.handleSubmit((values) => {
    const input = toJoinInput({ values, accountIds, inviteCode: code });

    if (input) {
      join.mutate({ id: competition.id, ...input });
    }
  });

  return {
    form,
    state: joinState(competition),
    accountOptions: accounts.map(({ accountId, nickname }) => ({ value: String(accountId), label: nickname })),
    accountValue: selectedAccount === null ? '' : String(selectedAccount),
    teams: openTeams(competition),
    isNewTeam: teamId === JOIN_FORM.newTeam,
    myTeam: competition.standings.find(({ id }) => id === competition.myTeamId)?.name ?? null,
    canLeave: competition.myTeamId !== null && competition.status !== 'finished',
    isPending: join.isPending || leave.isPending,
    onSubmit,
    onLeave: () => leave.mutate(competition.id)
  };
};
