import { z } from 'zod';

export const statRequirementsSchema = z.object({
  minBattles: z.number().int().nonnegative().optional(),
  minWn8: z.number().nonnegative().optional(),
  maxWn8: z.number().nonnegative().optional(),
  minWinRate: z.number().min(0).max(1).optional()
});
