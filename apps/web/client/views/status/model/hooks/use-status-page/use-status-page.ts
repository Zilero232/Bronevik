'use client';

import { useServiceHealth } from '@/entities/reference/service-health';

export const useStatusPage = () => {
  const { query, summary } = useServiceHealth();

  return {
    summary,
    isPending: query.isPending,
    isFetching: query.isFetching,
    checkedAt: query.dataUpdatedAt > 0 ? query.dataUpdatedAt : null,
    onRefresh: () => void query.refetch()
  };
};
