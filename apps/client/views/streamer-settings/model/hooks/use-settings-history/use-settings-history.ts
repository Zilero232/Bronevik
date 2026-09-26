'use client';

import { useQuery } from '@tanstack/react-query';

import { getStreamerSettingsHistory } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

export const useSettingsHistory = (slug: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.streamers.settingsHistory(slug),
    queryFn: () => getStreamerSettingsHistory(slug)
  });

  return {
    entries: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
    isRetrying: query.isRefetching,
    retry: () => void query.refetch()
  };
};
