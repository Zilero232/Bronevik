import { describe, expect, it } from 'vitest';

import type { TournamentBracket, TournamentParticipant } from '@/shared/api/tournaments';

import { bracketColumns, championOf, participantLabel, roundName } from '../bracket-columns';

const PARTICIPANTS: TournamentParticipant[] = [
  { accountId: 1, nickname: 'Alpha', teamName: null, seed: 1, verified: true },
  { accountId: 2, nickname: 'Bravo', teamName: 'Team B', seed: 2, verified: true },
  { accountId: 3, nickname: null, teamName: null, seed: 3, verified: true }
];

const BRACKET: TournamentBracket = {
  size: 4,
  rounds: [
    [
      { round: 0, index: 0, a: 1, b: null, winner: 1 },
      { round: 0, index: 1, a: 2, b: 3, winner: null }
    ],
    [{ round: 1, index: 0, a: 1, b: null, winner: null }]
  ]
};

describe('participantLabel', () => {
  it('prefers the team name, then the nickname, then the account id', () => {
    expect(participantLabel(PARTICIPANTS[1]!)).toBe('Team B');
    expect(participantLabel(PARTICIPANTS[0]!)).toBe('Alpha');
    expect(participantLabel(PARTICIPANTS[2]!)).toBe('#3');
  });
});

describe('roundName', () => {
  it('names the last rounds from the end', () => {
    expect(roundName({ round: 3, total: 4 })).toBe('final');
    expect(roundName({ round: 2, total: 4 })).toBe('semifinal');
    expect(roundName({ round: 1, total: 4 })).toBe('quarterfinal');
    expect(roundName({ round: 0, total: 4 })).toBe('round');
  });
});

describe('bracketColumns', () => {
  const columns = bracketColumns({ bracket: BRACKET, participants: PARTICIPANTS });

  it('makes one column per round', () => {
    expect(columns.map(({ name }) => name)).toEqual(['semifinal', 'final']);
  });

  it('maps account ids to participant labels', () => {
    expect(columns[0]?.matches[1]?.a?.label).toBe('Team B');
  });

  it('marks a first-round walkover as a bye that cannot be reported', () => {
    expect(columns[0]?.matches[0]).toMatchObject({ isBye: true, canReport: false, isDecided: true });
  });

  it('lets the organizer report a match once both sides are known', () => {
    expect(columns[0]?.matches[1]?.canReport).toBe(true);
    expect(columns[1]?.matches[0]?.canReport).toBe(false);
  });

  it('flags the winning slot', () => {
    expect(columns[0]?.matches[0]?.a?.isWinner).toBe(true);
  });

  it('blocks reporting a match whose next round already has a result', () => {
    const decided: TournamentBracket = {
      size: 2,
      rounds: [
        [
          { round: 0, index: 0, a: 1, b: 2, winner: null },
          { round: 0, index: 1, a: 3, b: 4, winner: null }
        ],
        [{ round: 1, index: 0, a: null, b: null, winner: 1 }]
      ]
    };

    expect(bracketColumns({ bracket: decided, participants: PARTICIPANTS })[0]?.matches[0]?.canReport).toBe(false);
  });
});

describe('championOf', () => {
  it('is null until the final is decided', () => {
    expect(championOf({ bracket: BRACKET, participants: PARTICIPANTS })).toBeNull();
  });

  it('names the final winner', () => {
    const finished: TournamentBracket = { size: 2, rounds: [[{ round: 0, index: 0, a: 1, b: 2, winner: 2 }]] };

    expect(championOf({ bracket: finished, participants: PARTICIPANTS })).toBe('Team B');
  });
});
