import type { RemovalRequest } from '@/entities/streamer/streamer';

import { streamersControllerRemovalRequest } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const requestStreamerRemoval = async ({ slug, ...body }: RemovalRequest): Promise<void> => {
  await fromSdk(() => streamersControllerRemovalRequest({ path: { slug }, body }));
};
