'use client';

import { useQuery } from '@tanstack/react-query';

import { getMissionPlan } from '@/entities/mission/mission';
import { usePlus } from '@/features/plus/plus-gate';
import { isPlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { useBranchLabel } from '../use-branch-label';

export const useMissionPlan = (operation: number) => {
  const { isSignedIn, isPlus, isPending: isPlusPending } = usePlus();
  const branchLabel = useBranchLabel();

  const query = useQuery({
    queryKey: QUERY_KEYS.missions.plan(operation),
    queryFn: ({ signal }) => getMissionPlan({ operation, signal }),
    enabled: isPlus,
    retry: false
  });

  return {
    branchLabel,
    query,
    isSignedIn: isPlusPending || isSignedIn,
    needsPlus: (isSignedIn && !isPlusPending && !isPlus) || isPlusRequiredError(query.error)
  };
};
