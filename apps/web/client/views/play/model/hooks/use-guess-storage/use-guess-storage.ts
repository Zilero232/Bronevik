'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { useHydrated } from '@/shared/lib';

import type { GuessStreak } from '../../../lib/streak';
import type { GuessBoard } from './use-guess-storage.types';

import { GUESS_TANK } from '../../../config';
import { EMPTY_STREAK } from '../../../lib/streak';

const NO_GUESSES: number[] = [];

export const useGuessStorage = (day: string | null) => {
  const isHydrated = useHydrated();
  const { value: board, set: setBoard } = useLocalStorage<GuessBoard | null>(GUESS_TANK.storageKey, null);
  const { value: storedStreak, set: setStreak } = useLocalStorage<GuessStreak>(GUESS_TANK.streakKey, EMPTY_STREAK);

  const guessIds = isHydrated && day !== null && board?.day === day ? board.guessIds : NO_GUESSES;
  const streak = isHydrated ? (storedStreak ?? EMPTY_STREAK) : EMPTY_STREAK;

  return { guessIds, streak, setBoard, setStreak };
};
