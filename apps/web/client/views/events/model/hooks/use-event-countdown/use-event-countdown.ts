'use client';

import { differenceInSeconds } from 'date-fns';

import { useCountdown } from '@/shared/lib';

import type { UseEventCountdownInput } from './use-event-countdown.types';

import { countdownParts } from '../../../lib/countdown-parts';

export const useEventCountdown = ({ endsAt }: UseEventCountdownInput) => {
  const countdown = useCountdown({ seconds: (now) => (endsAt ? Math.max(0, differenceInSeconds(new Date(endsAt), now)) : 0) });

  if (!endsAt || countdown.isExpired || countdown.left === 0) {
    return null;
  }

  return countdownParts(countdown.left);
};
