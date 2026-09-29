import * as z from 'zod/mini';

import { hudIconSchema } from '../../../../../shared/api/hud-protocol';

export const artyMeterSchema = z.object({
  battle: z.object({ hits: z.number(), splash: z.number(), damage: z.number(), modules: z.number(), stuns: z.number(), total: z.number() }),
  day: z.nullable(z.object({ battles: z.number(), total: z.number(), damage: z.number() })),
  scale: z.number(),
  icon: hudIconSchema
});
