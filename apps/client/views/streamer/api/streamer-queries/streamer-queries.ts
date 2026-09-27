import { queryOptions } from '@tanstack/react-query';

import { getStreamerBySlug } from '@/entities/streamer/streamer';
import { PREFETCHED_STALE_TIME } from '@/shared/api/query-client';
import { QUERY_KEYS } from '@/shared/constants';

export const streamerQueries = {
  profile: (slug: string) =>
    queryOptions({
      queryKey: QUERY_KEYS.streamers.profile(slug),
      queryFn: () => getStreamerBySlug(slug),
      staleTime: PREFETCHED_STALE_TIME
    })
};
