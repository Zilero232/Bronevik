'use client';

import { hoursClock, useCountdown } from '@/shared/lib';

import { secondsUntilNextPuzzle } from '../../../lib/puzzle-day';

export const useNextPuzzleClock = (onExpire: () => void) => {
  const { left } = useCountdown({ seconds: secondsUntilNextPuzzle, onExpire });

  return hoursClock(left);
};
