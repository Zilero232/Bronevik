import * as z from 'zod/mini';

import { hudIconSchema, hudToneSchema } from '../../../../../shared/api/hud-protocol';

const total = z.object({ key: z.string(), icon: hudIconSchema, value: z.number(), tone: hudToneSchema });

const row = z.object({
  kind: z.string(),
  amount: z.number(),
  tone: hudToneSchema,
  received: z.boolean(),
  icon: hudIconSchema,
  gold: z.boolean(),
  cls: hudIconSchema,
  name: z.string(),
  source: hudIconSchema,
  ammo_rack: hudIconSchema
});

export const damageLogSchema = z.object({ style: z.enum(['full', 'compact']), totals: z.array(total), rows: z.array(row) });

export const lastHitSchema = z.object({
  amount: z.number(),
  name: z.string(),
  cls: hudIconSchema,
  shell: hudIconSchema,
  source: hudIconSchema,
  ammo_rack: hudIconSchema,
  timeout_s: z.number()
});
