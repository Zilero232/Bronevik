import { accountIdSchema, uuidSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const idParamsSchema = z.object({
  id: uuidSchema
});

export const lestaAccountParamsSchema = z.object({
  accountId: accountIdSchema
});
