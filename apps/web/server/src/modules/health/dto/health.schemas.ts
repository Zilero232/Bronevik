import { healthSchema } from '@otmetki/schemas';
import { z } from 'zod';

import { CIRCUIT_STATE_NAME } from '../../collector/metrics';

export const heartbeatSchema = z.object({ collectedAt: z.iso.datetime() });

export const circuitSchema = z.object({ state: z.enum(CIRCUIT_STATE_NAME) });

export const healthReportSchema = healthSchema.pick({ status: true, info: true, error: true, details: true });

export const queuesSnapshotSchema = z.object({
  collectedAt: z.iso.datetime(),
  queues: z.record(z.string(), z.record(z.string(), z.number()))
});
