import type { z } from 'zod';

import type { healthReportSchema } from './dto';

export type HealthReport = z.infer<typeof healthReportSchema>;
