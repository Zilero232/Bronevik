import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const consumablesSchema = z.object({
  slots: z.array(z.object({ icon: hudIconSchema, quantity: z.number(), remaining: z.number(), total: z.number(), ready: z.boolean() })),
  shells: z.array(z.object({ icon: hudIconSchema, quantity: z.number(), current: z.boolean() })),
  stats: z.array(z.object({ icon: hudIconSchema, current: z.boolean(), text: z.string() }))
});

export const reloadTimerSchema = z.object({
  left: z.number(),
  total: z.number(),
  ready: z.boolean(),
  clip: z.number(),
  in_clip: z.nullable(z.number()),
  show_bar: z.boolean(),
  show_ready: z.boolean(),
  show_clip: z.boolean()
});
