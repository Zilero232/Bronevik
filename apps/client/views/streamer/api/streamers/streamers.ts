import type { RemovalRequestInput } from '@/entities/streamer/streamer';

import { streamersControllerRemovalRequest } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const requestStreamerRemoval = async ({ slug, ...body }: RemovalRequestInput): Promise<void> => {
  await fromSdk(() => streamersControllerRemovalRequest({ path: { slug }, body }));
};
