import type { VehicleSummary } from '@otmetki/schemas';

import type { GUESS_CELLS } from '../../config';

type GuessCellKey = (typeof GUESS_CELLS)[number];

export type CellVerdict = 'close' | 'match' | 'miss' | 'unknown';

type CellDirection = 'down' | 'up';

export type CellHint = {
  verdict: CellVerdict;
  direction: CellDirection | null;
};

export type GuessSubject = {
  vehicle: VehicleSummary;
  avgDamage: number | null;
  winRate: number | null;
};

export type CompareGuessInput = {
  guess: GuessSubject;
  target: GuessSubject;
};

export type GuessFeedback = {
  isCorrect: boolean;
  cells: Record<GuessCellKey, CellHint>;
};

export type NumericHintInput = {
  guess: number | null;
  target: number | null;
  match: number;
  close: number;
};

export type RelativeInput = {
  target: number | null;
  share: number;
};
