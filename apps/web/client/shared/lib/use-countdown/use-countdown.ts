'use client';

import { usePrevious } from '@siberiacancode/reactuse';
import { millisecondsInSecond, secondsInHour, secondsInMinute } from 'date-fns/constants';
import { useEffect, useEffectEvent } from 'react';

import type { Countdown, UseCountdownInput } from './use-countdown.types';

import { useClientNow } from '../use-client-now';

export const useCountdown = ({ seconds, onExpire }: UseCountdownInput): Countdown => {
  const now = useClientNow({ updateInterval: millisecondsInSecond });
  const left = now ? Math.max(0, Math.floor(seconds(now))) : null;
  const previous = usePrevious(left);
  const expire = useEffectEvent(() => onExpire?.());

  useEffect(() => {
    if (left === 0 && previous) {
      expire();
    }
  }, [left, previous]);

  const count = left ?? 0;

  return {
    left: count,
    hours: Math.floor(count / secondsInHour),
    minutes: Math.floor(count / secondsInMinute) % secondsInMinute,
    seconds: count % secondsInMinute,
    isExpired: left === 0
  };
};
