import { z } from 'zod';

export const heartbeatSchema = z.object({ collectedAt: z.iso.datetime() });

export const circuitSchema = z.object({ state: z.enum(['closed', 'open', 'half-open']) });

const indicatorSchema = z.looseObject({ status: z.enum(['up', 'degraded', 'down']) });

const indicatorsSchema = z.record(z.string(), indicatorSchema);

export const healthSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error', 'shutting_down']),
  info: indicatorsSchema.optional(),
  error: indicatorsSchema.optional(),
  details: indicatorsSchema
});
