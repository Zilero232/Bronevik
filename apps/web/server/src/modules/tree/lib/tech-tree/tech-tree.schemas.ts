import { z } from 'zod';

export const nextTanksSchema = z.array(z.object({ tankId: z.number().int().positive(), xp: z.number().nonnegative().optional() })).catch([]);
