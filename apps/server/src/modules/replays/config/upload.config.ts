import { FileInterceptor } from '@nestjs/platform-express';

import { REPLAY_UPLOAD } from './replays.config';

export const replayFileInterceptor = FileInterceptor(REPLAY_UPLOAD.field, { limits: { fileSize: REPLAY_UPLOAD.maxBytes, files: 1 } });
