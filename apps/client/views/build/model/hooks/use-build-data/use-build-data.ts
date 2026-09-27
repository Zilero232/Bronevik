'use client';

import { useQuery } from '@tanstack/react-query';

import { buildQueries } from '../../../api';

export const useBuildData = (slug: string) => {
  const tankQuery = useQuery(buildQueries.tank({ idOrSlug: slug }));
  const vehicle = tankQuery.data?.vehicle;
  const optionsQuery = useQuery({ ...buildQueries.options(vehicle?.tankId ?? 0), enabled: vehicle !== undefined });
  const failed = tankQuery.isError ? tankQuery : optionsQuery;

  return {
    data: vehicle && optionsQuery.data ? { vehicle, options: optionsQuery.data } : undefined,
    isError: tankQuery.isError || optionsQuery.isError,
    error: failed.error,
    isRefetching: tankQuery.isFetching || optionsQuery.isFetching,
    refetch: failed.refetch
  };
};
