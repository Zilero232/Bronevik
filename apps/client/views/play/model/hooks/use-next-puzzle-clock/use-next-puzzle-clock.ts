'use client';

import { useCountdown } from '@/shared/lib';

import { countdownClock } from '../../../lib/countdown';
import { secondsUntilNextPuzzle } from '../../../lib/daily-puzzle';
import { useGuessGame } from '../../context';

export const useNextPuzzleClock = () => {
  const { refreshDay } = useGuessGame();
  const { hours, minutes, seconds } = useCountdown({ seconds: secondsUntilNextPuzzle, onExpire: refreshDay });

  return countdownClock({ hours, minutes, seconds });
};
