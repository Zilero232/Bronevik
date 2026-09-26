'use client';

import { useTimer } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { countdownClock } from '../../../lib/countdown';
import { secondsUntilNextPuzzle } from '../../../lib/daily-puzzle';
import { useGuessGame } from '../../context';

export const useCountdown = () => {
  const { refreshDay } = useGuessGame();
  const [total] = useState(() => secondsUntilNextPuzzle(new Date()));
  const { days, hours, minutes, seconds } = useTimer(total, { onExpire: refreshDay });

  return countdownClock({ hours: days * 24 + hours, minutes, seconds });
};
