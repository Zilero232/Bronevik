import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const equipmentItemSchema = z.object({
  icon: hudIconSchema,
  overlay: hudIconSchema,
  name: z.string(),
  effect: z.string(),
  bonus: z.boolean()
});

export const battleLoadoutSchema = z.object({ size: z.number(), items: z.array(equipmentItemSchema) });
