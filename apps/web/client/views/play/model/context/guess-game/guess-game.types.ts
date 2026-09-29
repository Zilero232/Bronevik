import type { TankDetail, VehicleSummary } from '@otmetki/schemas';

import type { GuessStreak } from '@/entities/play/daily-puzzle';

import type { GuessFeedback, GuessSubject } from '../../../lib/compare-guess';
import type { GameStatus } from '../../../lib/game-status';

export type GuessEntry = {
  subject: GuessSubject;
  feedback: GuessFeedback;
};

export type GuessGame = {
  day: string;
  number: number;
  target: VehicleSummary;
  targetDetail: TankDetail | undefined;
  guesses: GuessEntry[];
  status: GameStatus;
  clueCount: number;
  streak: GuessStreak;
  currentStreak: number;
  refreshDay: () => void;
  submit: (vehicle: VehicleSummary) => void;
};

export type GuessGameState =
  { kind: 'error'; isRetrying: boolean; retry: () => void } | { kind: 'loading' } | { kind: 'ready'; game: GuessGame } | { kind: 'unavailable' };
