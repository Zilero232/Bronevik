import type { CreateFollow, FollowList } from '@/shared/api/generated';

import { socialControllerFollow, socialControllerListFollows, socialControllerUnfollow } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getFollows = (): Promise<FollowList> => fromSdk(() => socialControllerListFollows(SESSION_REQUEST));

export const addFollow = (input: CreateFollow): Promise<FollowList> => fromSdk(() => socialControllerFollow({ ...SESSION_REQUEST, body: input }));

export const removeFollow = async (id: string): Promise<void> => {
  await fromSdk(() => socialControllerUnfollow({ ...SESSION_REQUEST, path: { id } }));
};
