import type { z } from 'zod';

import type { pulseSchema } from './dto/pulse.schemas';

export type PulseView = z.infer<typeof pulseSchema>;
