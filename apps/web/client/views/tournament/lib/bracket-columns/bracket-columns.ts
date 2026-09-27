import type { TournamentParticipant } from '@/entities/tournament/tournament';

import type { BracketColumn, BracketColumnsInput, BracketRoundName, BracketSlot, RoundNameInput, SlotOfInput } from './bracket-columns.types';

export const participantLabel = (participant: Pick<TournamentParticipant, 'accountId' | 'nickname' | 'teamName'>): string =>
  participant.teamName ?? participant.nickname ?? `#${participant.accountId}`;

export const roundName = ({ round, total }: RoundNameInput): BracketRoundName => {
  const fromEnd = total - 1 - round;

  if (fromEnd === 0) {
    return 'final';
  }

  if (fromEnd === 1) {
    return 'semifinal';
  }

  return fromEnd === 2 ? 'quarterfinal' : 'round';
};

export const bracketColumns = ({ bracket, participants }: BracketColumnsInput): BracketColumn[] => {
  const byAccount = new Map(participants.map((participant) => [participant.accountId, participant]));
  const total = bracket.rounds.length;

  const slotOf = ({ accountId, winner }: SlotOfInput): BracketSlot | null => {
    if (accountId === null) {
      return null;
    }

    const participant = byAccount.get(accountId);

    return {
      accountId,
      label: participant ? participantLabel(participant) : `#${accountId}`,
      seed: participant?.seed ?? null,
      isWinner: winner === accountId
    };
  };

  return bracket.rounds.map((matches, round) => ({
    round,
    name: roundName({ round, total }),
    number: round + 1,
    matches: matches.map((match) => {
      const next = bracket.rounds[round + 1]?.[Math.floor(match.index / 2)];
      const isBye = round === 0 && (match.a === null) !== (match.b === null);

      return {
        round: match.round,
        index: match.index,
        a: slotOf({ accountId: match.a, winner: match.winner }),
        b: slotOf({ accountId: match.b, winner: match.winner }),
        isDecided: match.winner !== null,
        isBye,
        canReport: match.a !== null && match.b !== null && match.winner === null && (next === undefined || next.winner === null)
      };
    })
  }));
};

export const championOf = ({ bracket, participants }: BracketColumnsInput): string | null => {
  const winner = bracket.rounds.at(-1)?.[0]?.winner ?? null;

  if (winner === null) {
    return null;
  }

  const participant = participants.find(({ accountId }) => accountId === winner);

  return participant ? participantLabel(participant) : `#${winner}`;
};
