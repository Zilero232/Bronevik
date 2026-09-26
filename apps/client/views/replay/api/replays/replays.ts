import type { Replay, UpdateReplayInput } from '@/entities/replay/replay';

import { replaysControllerRemove, replaysControllerUpdate } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const updateReplay = ({ id, visibility }: UpdateReplayInput): Promise<Replay> =>
  fromSdk(() => replaysControllerUpdate({ ...SESSION_REQUEST, path: { id }, body: { visibility } }));

export const deleteReplay = async (id: string): Promise<void> => {
  await fromSdk(() => replaysControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};
