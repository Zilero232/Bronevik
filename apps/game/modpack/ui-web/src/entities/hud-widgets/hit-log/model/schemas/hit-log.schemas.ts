import * as z from 'zod/mini';

import { hudIconSchema, hudToneSchema } from '../../../../../shared/api/hud-protocol';

const row = z.object({
  outcome: z.nullable(z.string()),
  icon: hudIconSchema,
  tone: hudToneSchema,
  damage: z.nullable(z.number()),
  crits: z.number(),
  hits: z.number(),
  cls: hudIconSchema,
  name: z.string(),
  hp: z.nullable(z.number()),
  max: z.nullable(z.number()),
  note: z.string()
});

export const hitLogSchema = z.object({
  header: z.nullable(z.object({ hits: z.number(), pens: z.number(), damage: z.number() })),
  grouped: z.boolean(),
  detail: z.enum(['full', 'short', 'extended']),
  rows: z.array(row)
});
