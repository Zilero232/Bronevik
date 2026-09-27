import type { TournamentBracket, TournamentParticipant } from '@/entities/tournament/tournament';

export type BracketRoundName = 'final' | 'quarterfinal' | 'round' | 'semifinal';

export type BracketSlot = {
  accountId: number;
  label: string;
  seed: number | null;
  isWinner: boolean;
};

export type BracketMatchView = {
  round: number;
  index: number;
  a: BracketSlot | null;
  b: BracketSlot | null;
  isDecided: boolean;
  isBye: boolean;
  canReport: boolean;
};

export type BracketColumn = {
  round: number;
  name: BracketRoundName;
  number: number;
  matches: BracketMatchView[];
};

export type BracketColumnsInput = {
  bracket: TournamentBracket;
  participants: readonly TournamentParticipant[];
};

export type RoundNameInput = {
  round: number;
  total: number;
};

export type SlotOfInput = {
  accountId: number | null;
  winner: number | null;
};
