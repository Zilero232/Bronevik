'use client';

import { hoursClock, useCountdown } from '@/shared/lib';

import { secondsUntilNextPuzzle } from '../../../lib/daily-puzzle';
import { useGuessGame } from '../../context';

export const useNextPuzzleClock = () => {
  const { refreshDay } = useGuessGame();
  const { left } = useCountdown({ seconds: secondsUntilNextPuzzle, onExpire: refreshDay });

  return hoursClock(left);
};
