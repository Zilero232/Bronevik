import type { StreamerDirectory } from '@otmetki/schemas';

import type { StreamerDirectoryInput } from '@/entities/streamer/streamer';

import { streamersControllerList } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const getStreamerDirectory = (query: StreamerDirectoryInput): Promise<StreamerDirectory> => fromSdk(() => streamersControllerList({ query }));
