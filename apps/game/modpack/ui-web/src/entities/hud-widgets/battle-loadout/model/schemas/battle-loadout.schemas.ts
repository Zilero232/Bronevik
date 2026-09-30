import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const equipmentItemSchema = z.object({
  icon: hudIconSchema,
  overlay: hudIconSchema,
  name: z.string(),
  effect: z.string(),
  bonus: z.boolean(),
  boosted: z.boolean(),
  attention: z.boolean(),
  active: z.boolean(),
  used: z.boolean()
});

export const setBadgeSchema = z.object({ group: z.string(), text: z.string() });

export const battleLoadoutSchema = z.object({ size: z.number(), items: z.array(equipmentItemSchema), sets: z.array(setBadgeSchema) });
