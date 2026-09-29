import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const battleLoadoutSchema = z.object({
  compact: z.boolean(),
  size: z.number(),
  groups: z.array(z.object({ kind: z.string(), items: z.array(z.object({ icon: hudIconSchema, name: z.string(), bonus: z.boolean() })) }))
});
