import { clanIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const clanLookupParamsSchema = z.object({
  idOrTag: z.string().trim().min(2).max(12)
});

export const clanParamsSchema = z.object({
  id: clanIdSchema
});
