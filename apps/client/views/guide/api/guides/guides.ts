import type { LikeResult } from '@/entities/guide/guide';

import { guidesControllerLike, guidesControllerRemove, guidesControllerUnlike } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const removeGuide = async (id: string): Promise<void> => {
  await fromSdk(() => guidesControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};

export const likeGuide = (id: string): Promise<LikeResult> => fromSdk(() => guidesControllerLike({ ...SESSION_REQUEST, path: { id } }));

export const unlikeGuide = (id: string): Promise<LikeResult> => fromSdk(() => guidesControllerUnlike({ ...SESSION_REQUEST, path: { id } }));
