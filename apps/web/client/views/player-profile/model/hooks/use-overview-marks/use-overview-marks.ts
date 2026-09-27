'use client';

import { closestMarks } from '@/entities/player/marks';

import { OVERVIEW } from '../../../config';
import { useProfileContext } from '../../context';
import { usePlayerMarks } from '../use-profile-queries';

export const useOverviewMarks = () => {
  const { profile } = useProfileContext();
  const query = usePlayerMarks();

  return {
    counts: profile.summary.marks,
    closest: closestMarks({ items: query.data?.items ?? [], limit: OVERVIEW.closestMarksCount }),
    query
  };
};
