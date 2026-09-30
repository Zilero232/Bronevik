import * as z from 'zod/mini';

import { hudIconSchema, hudToneSchema } from '../../../../../shared/api/hud-protocol';

const levelNeedSchema = z.object({ level: z.number(), need: z.number() });

export const marksPanelSchema = z.object({
  style: z.enum(['compact', 'extended', 'minimal', 'custom']),
  has_curve: z.boolean(),
  percent: z.nullable(z.number()),
  delta: z.nullable(z.number()),
  estimated: z.boolean(),
  mark: hudIconSchema,
  tone: hudToneSchema,
  goal: z.nullable(levelNeedSchema),
  note: z.nullable(z.string()),
  text: z.nullable(z.string()),
  thresholds: z.array(z.object({ level: z.number(), need: z.number(), reached: z.boolean() })),
  step: z.nullable(z.object({ step: z.number(), need: z.number() })),
  average: z.nullable(z.object({ label: z.string(), ema: z.number(), ema_projected: z.number() })),
  battles: z.nullable(z.object({ level: z.number(), text: z.string() }))
});
