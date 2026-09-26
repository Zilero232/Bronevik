'use client';

import { useQuery } from '@tanstack/react-query';

import { channelLinks } from '@/entities/streamer/channel';
import { getStreamerBySlug } from '@/entities/streamer/streamer';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { STREAMER_PAGE } from '../../../config';

export const useStreamerPage = (slug: string) => {
  const query = useQuery({
    queryKey: QUERY_KEYS.streamers.profile(slug),
    queryFn: () => getStreamerBySlug(slug),
    retry: (failures, error) => !isNotFoundError(error) && failures < STREAMER_PAGE.retries
  });

  return { ...query, channels: query.data ? channelLinks(query.data.channels) : [] };
};
