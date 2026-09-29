import type { MapSummary } from '@otmetki/schemas';

import type { GuessStreak } from '@/entities/play/daily-puzzle';

import type { MapFocus, MapGameStatus } from '../../../lib/daily-map';
import type { MapHints } from '../../../lib/map-hints';

export type MapGuess = {
  map: MapSummary;
  hints: MapHints;
};

export type GuessMapGame = {
  number: number;
  target: MapSummary;
  focus: MapFocus;
  pool: MapSummary[];
  guesses: MapGuess[];
  status: MapGameStatus;
  zoom: number;
  streak: GuessStreak;
  currentStreak: number;
  refreshDay: () => void;
  submit: (map: MapSummary) => void;
};

export type GuessMapState =
  { kind: 'error'; isRetrying: boolean; retry: () => void } | { kind: 'loading' } | { kind: 'ready'; game: GuessMapGame } | { kind: 'unavailable' };
