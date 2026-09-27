import { z } from 'zod';

import { REPLAY_UPLOAD } from '../../config';

export const modVisibilitySchema = z.enum(REPLAY_UPLOAD.modVisibilities);
