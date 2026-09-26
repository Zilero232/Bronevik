'use client';

import { useTimer } from '@siberiacancode/reactuse';
import { secondsInHour } from 'date-fns/constants';
import { useMemo, useState } from 'react';

import type { Countdown, UseCountdownInput } from './use-countdown.types';

import { useClientNow } from '../use-client-now';

export const useCountdown = ({ seconds, onExpire }: UseCountdownInput): Countdown => {
  const [start] = useState(() => seconds);
  const now = useClientNow();
  const total = useMemo(() => (typeof start === 'number' ? start : now ? start(now) : 0), [start, now]);
  const timer = useTimer(total, { onExpire });

  return {
    left: timer.count,
    hours: Math.floor(timer.count / secondsInHour),
    minutes: timer.minutes,
    seconds: timer.seconds,
    isExpired: timer.count === 0 && (typeof start === 'number' || now !== null)
  };
};
