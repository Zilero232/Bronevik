'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getStreamerSettingsHistory } from '../../../api';

export const useSettingsHistory = (slug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.streamers.settingsHistory(slug),
    queryFn: () => getStreamerSettingsHistory(slug)
  });
