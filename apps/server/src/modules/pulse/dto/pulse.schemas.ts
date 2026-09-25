import { countSchema, isoDateTimeSchema } from '@bronevik/schemas';
import { z } from 'zod';

export const pulseSchema = z.object({
  timezone: z.string(),
  since: isoDateTimeSchema,
  activePlayers: countSchema,
  trackedPlayers: countSchema,
  heatmap: z.array(z.array(countSchema)),
  bestHours: z.array(z.object({ hour: z.number().int().min(0).max(23), share: z.number().min(0).max(1) })),
  series: z.array(z.object({ at: isoDateTimeSchema, players: countSchema })),
  computedAt: isoDateTimeSchema
});
