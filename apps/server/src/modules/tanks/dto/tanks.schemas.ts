import { tankIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const tankLookupParamsSchema = z.object({
  idOrSlug: z.string().trim().min(1).max(128)
});

export const tankParamsSchema = z.object({
  id: tankIdSchema
});
