import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const componentSchema = z.enum(['ok', 'down']);

export const healthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  database: componentSchema,
  redis: componentSchema,
  worker: z.enum(['ok', 'stale', 'unknown']),
  lestaCircuit: z.enum(['closed', 'open', 'half-open', 'unknown'])
});

export class HealthDto extends createZodDto(healthSchema) {}
