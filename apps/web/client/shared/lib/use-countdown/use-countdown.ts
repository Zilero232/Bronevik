'use client';

import { usePrevious } from '@siberiacancode/reactuse';
import { millisecondsInSecond } from 'date-fns/constants';
import { useEffect, useEffectEvent } from 'react';

import type { Countdown, UseCountdownInput } from './use-countdown.types';

import { useClientNow } from '../use-client-now';

export const useCountdown = ({ seconds, onExpire, updateInterval = millisecondsInSecond }: UseCountdownInput): Countdown => {
  const now = useClientNow({ updateInterval });
  const left = now ? Math.max(0, Math.floor(seconds(now))) : null;
  const previous = usePrevious(left);
  const expire = useEffectEvent(() => onExpire?.());

  useEffect(() => {
    if (left === 0 && previous) {
      expire();
    }
  }, [left, previous]);

  return { left: left ?? 0, isExpired: left === 0 };
};
