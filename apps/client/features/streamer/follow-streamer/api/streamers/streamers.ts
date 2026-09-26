import type { StreamerFollow } from '@otmetki/schemas';

import type { FollowStreamerRequest } from '@/entities/streamer/streamer';

import { streamersControllerFollow, streamersControllerMyFollows, streamersControllerUnfollow } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getMyFollows = (): Promise<StreamerFollow[]> => fromSdk(() => streamersControllerMyFollows(SESSION_REQUEST));

export const followStreamer = ({ slug, tankId }: FollowStreamerRequest): Promise<StreamerFollow[]> =>
  fromSdk(() => streamersControllerFollow({ ...SESSION_REQUEST, path: { slug }, body: { tankId: tankId ?? null } }));

export const unfollowStreamer = async (slug: string): Promise<void> => {
  await fromSdk(() => streamersControllerUnfollow({ ...SESSION_REQUEST, path: { slug } }));
};
