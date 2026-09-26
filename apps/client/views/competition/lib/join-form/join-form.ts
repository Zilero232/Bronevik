import type { Competition, CompetitionTeam } from '@otmetki/schemas';

import { COMPETITION } from '@otmetki/schemas';

import type { ChosenAccountInput, JoinCompetitionView, JoinRequest, JoinState, ToJoinInput } from './join-form.types';

import { JOIN_FORM } from '../../config/competition-page.constants';

export const chosenAccount = ({ value, accountIds }: ChosenAccountInput): number | null => {
  const picked = Number(value);

  if (value !== '' && accountIds.includes(picked)) {
    return picked;
  }

  return accountIds[0] ?? null;
};

export const openTeams = (competition: Pick<Competition, 'maxTeamSize' | 'standings'>): CompetitionTeam[] =>
  competition.standings.filter(({ members }) => members.length < competition.maxTeamSize);

export const joinState = (competition: JoinCompetitionView): JoinState => {
  if (competition.myTeamId !== null) {
    return 'joined';
  }

  if (competition.status === 'finished') {
    return 'closed';
  }

  return openTeams(competition).length === 0 && competition.standings.length >= COMPETITION.maxTeams ? 'full' : 'open';
};

export const toJoinInput = ({ values, accountIds, inviteCode }: ToJoinInput): JoinRequest | null => {
  const accountId = chosenAccount({ value: values.accountId, accountIds });

  if (accountId === null) {
    return null;
  }

  return {
    accountId,
    ...(values.teamId === JOIN_FORM.newTeam ? { teamName: values.teamName.trim() } : { teamId: values.teamId }),
    ...(inviteCode ? { inviteCode } : {})
  };
};
