import type { z } from 'zod';

import type { healthReportSchema, loadFailureSchema } from './game-health.schemas';

export type LoadFailure = z.infer<typeof loadFailureSchema>;

export type FailureKind = LoadFailure['kind'];

export type HealthReport = z.infer<typeof healthReportSchema>;
