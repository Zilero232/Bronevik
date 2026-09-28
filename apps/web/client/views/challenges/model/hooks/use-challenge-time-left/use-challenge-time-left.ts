'use client';

import { secondsUntil } from '@/entities/social/challenge';
import { durationParts, useCountdown } from '@/shared/lib';

import { CHALLENGES_VIEW } from '../../../config';

export const useChallengeTimeLeft = (endsAt: string) => {
  const { left } = useCountdown({ seconds: (now) => secondsUntil({ endsAt, now }), updateInterval: CHALLENGES_VIEW.countdownTickMs });

  return left > 0 ? durationParts(left) : null;
};
