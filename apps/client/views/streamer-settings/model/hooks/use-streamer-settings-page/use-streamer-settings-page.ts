'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { getStreamerSettings } from '../../../api';
import { STREAMER_SETTINGS_PAGE } from '../../../config';
import { settingsGroups } from '../../../lib/settings-page';

export const useStreamerSettingsPage = (slug: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.streamers.settings(slug),
    queryFn: () => getStreamerSettings(slug),
    retry: (failures, error) => !isNotFoundError(error) && failures < STREAMER_SETTINGS_PAGE.retries
  });

  return {
    query,
    groups: query.data ? settingsGroups(query.data) : []
  };
};
