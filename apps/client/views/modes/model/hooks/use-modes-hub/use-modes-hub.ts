'use client';

import { useQuery } from '@tanstack/react-query';

import { getModesHub } from '@/entities/mode/mode';
import { QUERY_KEYS } from '@/shared/constants';

import { latestComputedAt, modePanels } from '../../../lib/mode-panels';

export const useModesHub = () => {
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.modes.hub,
    queryFn: ({ signal }) => getModesHub({ signal })
  });

  return {
    panels: data ? modePanels(data.modes) : [],
    windowDays: data?.windowDays ?? null,
    computedAt: data ? latestComputedAt(data.modes) : null,
    isPending,
    isError,
    isRetrying: isFetching,
    onRetry: () => void refetch()
  };
};
