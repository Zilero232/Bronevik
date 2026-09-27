'use client';

import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';
import { useCountdown } from '@/shared/lib';

import { resetClock, secondsUntil } from '../../../lib/reset-countdown';

export const useResetCountdown = (nextResetAt: string) => {
  const queryClient = useQueryClient();
  const countdown = useCountdown({
    seconds: (now) => secondsUntil({ at: nextResetAt, now: now.getTime() }),
    onExpire: () => void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.analytics.all })
  });

  return resetClock(countdown);
};
