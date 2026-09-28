'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getStreamerSettings } from '../../../api';
import { settingsGroups } from '../../../lib/settings-page';

export const useStreamerSettingsPage = (slug: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.streamers.settings(slug),
    queryFn: () => getStreamerSettings(slug)
  });

  const { data: settings } = query;

  return {
    query,
    groups: settings ? settingsGroups(settings) : []
  };
};
