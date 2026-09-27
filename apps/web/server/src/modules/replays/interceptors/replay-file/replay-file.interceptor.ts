import { FileInterceptor } from '@nestjs/platform-express';

import { REPLAY_UPLOAD } from '../../config';

export const ReplayFileInterceptor = FileInterceptor(REPLAY_UPLOAD.field, { limits: { fileSize: REPLAY_UPLOAD.maxBytes, files: 1 } });
