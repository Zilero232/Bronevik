import { infiniteQueryOptions } from '@tanstack/react-query';

import type { StreamerDirectoryInput } from '@/entities/streamer/streamer';

import { QUERY_KEYS } from '@/shared/constants';

import { DIRECTORY } from '../../config';
import { getStreamerDirectory } from '../streamers';

export const directoryQueries = {
  list: (params: StreamerDirectoryInput) =>
    infiniteQueryOptions({
      queryKey: QUERY_KEYS.streamers.directory(params),
      queryFn: ({ pageParam }) => getStreamerDirectory({ ...params, cursor: pageParam }),
      initialPageParam: 0,
      getNextPageParam: (page) => page.nextCursor ?? undefined,
      staleTime: DIRECTORY.staleMs
    })
};
