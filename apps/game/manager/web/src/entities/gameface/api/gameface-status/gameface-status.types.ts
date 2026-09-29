import type { z } from 'zod';

import type { gamefaceStatusSchema } from './gameface-status.schemas';

export type GamefaceStatus = z.infer<typeof gamefaceStatusSchema>;
