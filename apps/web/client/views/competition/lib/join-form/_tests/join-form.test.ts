import type { CompetitionTeam } from '@otmetki/schemas';

import { COMPETITION } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { JoinCompetitionView } from '../join-form.types';

import { JOIN_FORM } from '../../../config';
import { chosenAccount, joinState, openTeams, toJoinInput } from '../join-form';
import { joinFormSchema } from '../join-form.schemas';

const member = (accountId: number) => ({ accountId, nickname: null, battles: 0, score: 0, source: 'none' as const });

const team = (id: string, size: number): CompetitionTeam => ({
  id,
  name: id,
  rank: 1,
  score: 0,
  battles: 0,
  members: Array.from({ length: size }, (_, index) => member(index + 1))
});

const view = (patch: Partial<JoinCompetitionView>): JoinCompetitionView => ({
  maxTeamSize: COMPETITION.maxTeamSize,
  myTeamId: null,
  standings: [],
  status: 'upcoming',
  ...patch
});

describe('chosenAccount', () => {
  it('keeps a picked account the user owns', () => {
    expect(chosenAccount({ value: '22', accountIds: [11, 22] })).toBe(22);
  });

  it('falls back to the first own account for an empty or foreign pick', () => {
    expect(chosenAccount({ value: '', accountIds: [11, 22] })).toBe(11);
    expect(chosenAccount({ value: '99', accountIds: [11, 22] })).toBe(11);
    expect(chosenAccount({ value: '', accountIds: [] })).toBeNull();
  });
});

describe('openTeams', () => {
  it('lists only teams with a free seat', () => {
    const competition = view({ standings: [team('full', COMPETITION.maxTeamSize), team('room', COMPETITION.maxTeamSize - 1)] });

    expect(openTeams(competition).map(({ id }) => id)).toEqual(['room']);
  });
});

describe('joinState', () => {
  it('is joined once the user has a team, whatever the status', () => {
    expect(joinState(view({ myTeamId: 'mine', status: 'finished' }))).toBe('joined');
  });

  it('is closed after the finish', () => {
    expect(joinState(view({ status: 'finished' }))).toBe('closed');
  });

  it('is full when every team is full and no team can be added', () => {
    const standings = Array.from({ length: COMPETITION.maxTeams }, (_, index) => team(String(index), COMPETITION.maxTeamSize));

    expect(joinState(view({ standings, status: 'running' }))).toBe('full');
  });

  it('is open while a new team can still be named', () => {
    expect(joinState(view({ standings: [team('full', COMPETITION.maxTeamSize)] }))).toBe('open');
  });
});

describe('toJoinInput', () => {
  it('names a new team and passes the invite code', () => {
    expect(toJoinInput({ values: { accountId: '', teamId: JOIN_FORM.newTeam, teamName: '  Crew  ' }, accountIds: [7], inviteCode: 'ABC' })).toEqual({
      accountId: 7,
      teamName: 'Crew',
      inviteCode: 'ABC'
    });
  });

  it('joins an existing team without a code', () => {
    expect(toJoinInput({ values: { accountId: '7', teamId: 'team-id', teamName: '' }, accountIds: [7], inviteCode: null })).toEqual({
      accountId: 7,
      teamId: 'team-id'
    });
  });

  it('gives nothing without a linked account', () => {
    expect(toJoinInput({ values: { accountId: '', teamId: 'team-id', teamName: '' }, accountIds: [], inviteCode: null })).toBeNull();
  });
});

describe('joinFormSchema', () => {
  it('needs a team name only for a new team', () => {
    expect(joinFormSchema.safeParse({ accountId: '', teamId: JOIN_FORM.newTeam, teamName: '' }).success).toBe(false);
    expect(joinFormSchema.safeParse({ accountId: '', teamId: JOIN_FORM.newTeam, teamName: 'Crew' }).success).toBe(true);
    expect(joinFormSchema.safeParse({ accountId: '', teamId: 'team-id', teamName: '' }).success).toBe(true);
  });

  it('rejects a team name over the limit', () => {
    expect(joinFormSchema.safeParse({ accountId: '', teamId: JOIN_FORM.newTeam, teamName: 'x'.repeat(COMPETITION.teamNameMax + 1) }).success).toBe(
      false
    );
  });
});
