import { healthSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const heartbeatSchema = z.object({ collectedAt: z.iso.datetime() });

export const circuitSchema = z.object({ state: z.enum(['closed', 'open', 'half-open']) });

export const healthReportSchema = healthSchema.pick({ status: true, info: true, error: true, details: true });

export const queuesSnapshotSchema = z.object({
  collectedAt: z.iso.datetime(),
  queues: z.record(z.string(), z.record(z.string(), z.number()))
});
