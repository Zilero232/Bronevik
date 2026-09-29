import { z } from 'zod';

const indicatorSchema = z.looseObject({
  status: z.enum(['up', 'degraded', 'down']),
  state: z.string().optional(),
  mode: z.string().optional(),
  collectedAt: z.iso.datetime().optional(),
  message: z.string().optional()
});

export const healthSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error', 'shutting_down']),
  details: z.record(z.string(), indicatorSchema)
});
