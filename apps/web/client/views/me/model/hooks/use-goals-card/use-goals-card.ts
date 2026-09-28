'use client';

import { useMutation } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getGoals, removeGoal } from '../../../api';
import { useMeSection } from '../use-me-section';

export const useGoalsCard = () => {
  const { data: goals, isPending, isError, isFetching, refetch } = useMeSection({ section: 'goals', fetcher: getGoals });
  const remove = useMutation({
    mutationFn: removeGoal,
    meta: { successKey: 'me.toast.goalRemoved', errorKey: 'me.toast.failed', invalidates: [QUERY_KEYS.me.section('goals')] }
  });

  return {
    goals,
    isPending,
    isError,
    isRetrying: isFetching,
    onRetry: () => void refetch(),
    onRemove: (id: string) => remove.mutate(id)
  };
};
