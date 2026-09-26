import type {
  Heatmap,
  HeatmapInput,
  MyReplaysInput,
  Replay,
  ReplayDetailInput,
  ReplayPage,
  ReplaySearchInput,
  UpdateReplayInput,
  UploadedReplay,
  UploadReplayInput
} from './replays.types';

import {
  replaysControllerGet,
  replaysControllerHeatmap,
  replaysControllerMine,
  replaysControllerRemove,
  replaysControllerSearch,
  replaysControllerUpdate
} from '../generated';
import { zUploadedReplay } from '../generated/zod.gen';
import { api, SESSION_REQUEST } from '../http';
import { fromSdk, fromServer } from '../source';
import { REPLAY_UPLOAD_REQUEST } from './replays.constants';

export const listReplays = ({ signal, ...query }: ReplaySearchInput): Promise<ReplayPage> =>
  fromSdk(() => replaysControllerSearch({ query, signal }));

export const listMyReplays = ({ signal, ...query }: MyReplaysInput): Promise<ReplayPage> =>
  fromSdk(() => replaysControllerMine({ ...SESSION_REQUEST, query, signal }));

export const getReplay = ({ id, signal }: ReplayDetailInput): Promise<Replay> =>
  fromSdk(() => replaysControllerGet({ ...SESSION_REQUEST, path: { id }, signal }));

export const updateReplay = ({ id, visibility }: UpdateReplayInput): Promise<Replay> =>
  fromSdk(() => replaysControllerUpdate({ ...SESSION_REQUEST, path: { id }, body: { visibility } }));

export const deleteReplay = async (id: string): Promise<void> => {
  await fromSdk(() => replaysControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};

export const getHeatmap = ({ arenaId, signal, ...query }: HeatmapInput): Promise<Heatmap> =>
  fromSdk(() => replaysControllerHeatmap({ path: { arenaId }, query, signal }));

export const uploadReplay = ({ file, visibility, signal, onProgress }: UploadReplayInput): Promise<UploadedReplay> =>
  fromServer(async () => {
    const form = new FormData();

    form.append(REPLAY_UPLOAD_REQUEST.field, file);

    if (visibility) {
      form.append(REPLAY_UPLOAD_REQUEST.visibilityField, visibility);
    }

    const { data } = await api.post<unknown>(REPLAY_UPLOAD_REQUEST.path, form, {
      ...SESSION_REQUEST,
      signal,
      timeout: REPLAY_UPLOAD_REQUEST.timeoutMs,
      onUploadProgress: ({ loaded, total }) => {
        if (onProgress && total) {
          onProgress(Math.min(1, loaded / total));
        }
      }
    });

    return zUploadedReplay.parse(data);
  });
