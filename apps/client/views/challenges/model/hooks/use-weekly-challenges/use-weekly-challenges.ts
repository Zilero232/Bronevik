'use client';

import { useQuery } from '@tanstack/react-query';

import { useCommunityViewer } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';
import { useCountdown } from '@/shared/lib';

import { getWeeklyChallenges } from '../../../api';
import { CHALLENGES_VIEW } from '../../../config';
import { challengeRows, challengeSummary, secondsUntil } from '../../../lib/challenge-progress';

export const useWeeklyChallenges = () => {
  const viewer = useCommunityViewer();
  const query = useQuery({
    queryKey: QUERY_KEYS.social.challenges,
    queryFn: ({ signal }) => getWeeklyChallenges({ signal }),
    enabled: viewer.isSignedIn,
    staleTime: CHALLENGES_VIEW.staleMs
  });

  const { data: weekly } = query;
  const endsAt = weekly?.endsAt ?? null;
  const countdown = useCountdown({ seconds: (now) => (endsAt ? secondsUntil({ endsAt, now }) : 0) });

  const rows = challengeRows(weekly?.challenges ?? []);

  return {
    query,
    rows,
    summary: weekly ? challengeSummary(rows) : null,
    needsLesta: viewer.isSignedIn && !viewer.isPending && !viewer.hasLesta,
    timeLeft:
      endsAt && countdown.left > 0
        ? { days: Math.floor(countdown.hours / CHALLENGES_VIEW.hoursPerDay), hours: countdown.hours % CHALLENGES_VIEW.hoursPerDay }
        : null
  };
};
