'use client';

import { getGoals, removeGoal } from '../../../api';
import { useMeMutation } from '../use-me-mutation';
import { useMeSection } from '../use-me-section';

export const useGoalsCard = () => {
  const { data: goals, isPending, isError, isFetching, refetch } = useMeSection({ section: 'goals', fetcher: getGoals });
  const remove = useMeMutation({ section: 'goals', mutationFn: removeGoal, successKey: 'goalRemoved' });

  return {
    goals,
    isPending,
    isError,
    isRetrying: isFetching,
    onRetry: () => void refetch(),
    onRemove: (id: string) => remove.mutate(id)
  };
};
