'use client';

import { closestMarks } from '@/entities/player/marks';

import { OVERVIEW } from '../../../config';
import { useProfileContext } from '../../context';
import { usePlayerMarks } from '../use-profile-queries';

export const useOverviewMarks = () => {
  const { profile } = useProfileContext();
  const { data: marks, isPending, isError, isRefetching, refetch } = usePlayerMarks();

  return {
    counts: profile.summary.marks,
    closest: closestMarks({ items: marks?.items ?? [], limit: OVERVIEW.closestMarksCount }),
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
