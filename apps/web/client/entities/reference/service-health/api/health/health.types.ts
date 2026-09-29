import type { z } from 'zod';

import type { healthSchema } from './health.schemas';

export type Health = z.infer<typeof healthSchema>;

export type HealthIndicator = Health['details'][string];

export type HealthInput = {
  signal?: AbortSignal;
};
