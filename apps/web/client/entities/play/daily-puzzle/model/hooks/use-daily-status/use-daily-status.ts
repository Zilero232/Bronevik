'use client';

import type { DailyPuzzleKey } from '../../../config';

import { DAILY_PUZZLES } from '../../../config';
import { dailyStatus } from '../../../lib/daily-status';
import { puzzleNumber } from '../../../lib/puzzle-day';
import { useDailyStorage } from '../use-daily-storage';
import { useNextPuzzleClock } from '../use-next-puzzle-clock';
import { usePuzzleDay } from '../use-puzzle-day';

export const useDailyStatus = (puzzle: DailyPuzzleKey) => {
  const { epoch, storageKey, streakKey } = DAILY_PUZZLES[puzzle];
  const { day, refreshDay } = usePuzzleDay();
  const { guessIds, streak } = useDailyStorage<unknown>({ day, storageKey, streakKey });
  const clock = useNextPuzzleClock(refreshDay);

  if (day === null) {
    return { status: null, number: null, clock: null };
  }

  return { status: dailyStatus({ streak, today: day, attempts: guessIds.length }), number: puzzleNumber({ epoch, day }), clock };
};
