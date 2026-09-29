import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const marksPanelSchema = z.object({
  style: z.enum(['extended', 'compact', 'minimal']),
  has_curve: z.boolean(),
  percent: z.nullable(z.number()),
  delta: z.nullable(z.number()),
  marks: z.nullable(z.number()),
  mark: hudIconSchema,
  color: z.string(),
  damage: z.number(),
  thresholds: z.array(z.object({ level: z.number(), need: z.number(), reached: z.boolean() })),
  step: z.nullable(z.object({ step: z.number(), need: z.number() })),
  battles: z.nullable(z.object({ level: z.number(), count: z.number() })),
  text: z.nullable(z.string())
});
