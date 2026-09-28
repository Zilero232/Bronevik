'use client';

import { useQuery } from '@tanstack/react-query';

import { useCommunityViewer } from '@/entities/auth/session';
import { challengeRows, challengeSummary, getWeeklyChallenges } from '@/entities/social/challenge';
import { QUERY_KEYS } from '@/shared/constants';

import { CHALLENGES_VIEW } from '../../../config';

export const useWeeklyChallenges = () => {
  const viewer = useCommunityViewer();
  const query = useQuery({
    queryKey: QUERY_KEYS.social.challenges,
    queryFn: ({ signal }) => getWeeklyChallenges({ signal }),
    enabled: viewer.isSignedIn,
    staleTime: CHALLENGES_VIEW.staleMs
  });

  const { data: weekly } = query;
  const rows = challengeRows(weekly?.challenges ?? []);

  return {
    query,
    rows,
    summary: weekly ? challengeSummary(rows) : null,
    needsLesta: viewer.isSignedIn && !viewer.isPending && !viewer.hasLesta,
    endsAt: weekly?.endsAt ?? null
  };
};
