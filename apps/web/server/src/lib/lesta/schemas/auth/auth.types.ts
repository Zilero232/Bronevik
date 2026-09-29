import type { z } from 'zod';

import type { prolongateSchema } from './auth.schemas';

export type ProlongateResult = z.infer<typeof prolongateSchema>;
