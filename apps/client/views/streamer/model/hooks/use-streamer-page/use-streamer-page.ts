'use client';

import { useQuery } from '@tanstack/react-query';

import { isNotFoundError } from '@/shared/api/source';
import { getStreamerBySlug } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import { STREAMER_PAGE } from '../../../config';

export const useStreamerPage = (slug: string) =>
  useQuery({
    queryKey: QUERY_KEYS.streamers.profile(slug),
    queryFn: () => getStreamerBySlug(slug),
    retry: (failures, error) => !isNotFoundError(error) && failures < STREAMER_PAGE.retries
  });
