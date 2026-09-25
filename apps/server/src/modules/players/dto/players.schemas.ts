import { z } from 'zod';

export const playerParamsSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const playerLookupParamsSchema = z.object({
  idOrNick: z.string().trim().min(2).max(24)
});

export const sessionParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  sessionId: z.uuid()
});
