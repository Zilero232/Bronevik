import type { UploadedReplay, UploadReplayInput } from '@/entities/replay/replay';

import { REPLAY_UPLOAD_REQUEST } from '@/entities/replay/replay';
import { zUploadedReplay } from '@/shared/api/generated/zod.gen';
import { api, SESSION_REQUEST } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

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
