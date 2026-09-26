import type { StreamerDirectory } from '@otmetki/schemas';

import type { StreamerDirectoryFilters } from '@/entities/streamer/streamer';

import { streamersControllerList } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const getStreamerDirectory = (query: StreamerDirectoryFilters): Promise<StreamerDirectory> =>
  fromSdk(() => streamersControllerList({ query }));
