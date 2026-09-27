import type { z } from 'zod';

import type { storedShotSchema } from './stored-shots.schemas';

export type StoredShot = z.infer<typeof storedShotSchema>;
