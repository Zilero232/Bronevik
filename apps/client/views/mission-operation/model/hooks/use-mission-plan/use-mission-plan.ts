'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getMissionPlan } from '@/shared/api/missions';
import { isPlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { useBranchLabel } from '../use-branch-label';

export const useMissionPlan = (operation: number) => {
  const { data: session } = useAuthSession();
  const branchLabel = useBranchLabel();

  const plan = useQuery({
    queryKey: QUERY_KEYS.missions.plan(operation),
    queryFn: ({ signal }) => getMissionPlan({ operation, signal }),
    enabled: Boolean(session),
    retry: false
  });

  return {
    branchLabel,
    plan: plan.data,
    isSignedIn: Boolean(session),
    isPending: plan.isPending && plan.fetchStatus !== 'idle',
    needsPlus: isPlusRequiredError(plan.error),
    isError: plan.isError && !isPlusRequiredError(plan.error),
    isRetrying: plan.isFetching,
    retry: () => void plan.refetch()
  };
};
