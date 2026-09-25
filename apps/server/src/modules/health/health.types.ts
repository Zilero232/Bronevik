import type { z } from 'zod';

import type { healthSchema } from './dto';

export type Health = z.infer<typeof healthSchema>;
