'use client';

import { usePlayerDigest as usePlayerDigestQueries } from '@/entities/player/profile';

import { MINI_APP } from '../../../config';
import { closestMarks } from '../../../lib/dashboard-picks';

export const usePlayerDigest = (accountId: number) => {
  const { profile, session, marks, isError, isRetrying, retry } = usePlayerDigestQueries(accountId);

  return {
    profile,
    session,
    marks: marks ? { summary: marks.summary, chases: closestMarks({ items: marks.items, limit: MINI_APP.marksLimit }) } : undefined,
    isError,
    isRetrying,
    retry
  };
};
