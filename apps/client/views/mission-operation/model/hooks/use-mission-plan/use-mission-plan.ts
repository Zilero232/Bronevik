'use client';

import { useQuery } from '@tanstack/react-query';

import { usePlus } from '@/features/plus/plus-gate';
import { getMissionPlan } from '@/shared/api/missions';
import { isPlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { useBranchLabel } from '../use-branch-label';

export const useMissionPlan = (operation: number) => {
  const { isSignedIn, isPlus, isPending: isPlusPending } = usePlus();
  const branchLabel = useBranchLabel();

  const plan = useQuery({
    queryKey: QUERY_KEYS.missions.plan(operation),
    queryFn: ({ signal }) => getMissionPlan({ operation, signal }),
    enabled: isPlus,
    retry: false
  });

  const isPlusRequired = isPlusRequiredError(plan.error);

  return {
    branchLabel,
    plan: plan.data,
    isSignedIn: isPlusPending || isSignedIn,
    isPending: isPlusPending || (plan.isPending && plan.fetchStatus !== 'idle'),
    needsPlus: (isSignedIn && !isPlusPending && !isPlus) || isPlusRequired,
    isError: plan.isError && !isPlusRequired,
    isRetrying: plan.isFetching,
    retry: () => void plan.refetch()
  };
};
