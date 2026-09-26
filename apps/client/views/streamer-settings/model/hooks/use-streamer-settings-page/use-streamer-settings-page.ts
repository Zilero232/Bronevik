'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';
import { getStreamerSettings } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import { STREAMER_SETTINGS_PAGE } from '../../../config';
import { settingsGroups } from '../../../lib/settings-page';

export const useStreamerSettingsPage = (slug: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.streamers.settings(slug),
    queryFn: () => getStreamerSettings(slug),
    retry: (failures, error) => !isNotFoundError(error) && failures < STREAMER_SETTINGS_PAGE.retries
  });

  return {
    view: query.data ?? null,
    groups: query.data ? settingsGroups(query.data) : [],
    isPending: query.isPending,
    isRetrying: query.isRefetching,
    error: query.error,
    retry: () => void query.refetch()
  };
};
