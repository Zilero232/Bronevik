'use client';

import { useLocalStorage } from '@siberiacancode/reactuse';

import { useHydrated } from '@/shared/lib';

import type { GuessStreak } from '../../../lib/streak';
import type { DailyBoard, UseDailyStorageInput } from './use-daily-storage.types';

import { EMPTY_STREAK } from '../../../config';

export const useDailyStorage = <TGuess>({ day, storageKey, streakKey }: UseDailyStorageInput) => {
  const isHydrated = useHydrated();
  const { value: board, set: setBoard } = useLocalStorage<DailyBoard<TGuess> | null>(storageKey, null);
  const { value: storedStreak, set: setStreak } = useLocalStorage<GuessStreak>(streakKey, EMPTY_STREAK);

  const guessIds: readonly TGuess[] = isHydrated && day !== null && board?.day === day ? board.guessIds : [];
  const streak = isHydrated ? (storedStreak ?? EMPTY_STREAK) : EMPTY_STREAK;

  return { guessIds, streak, setBoard, setStreak };
};
