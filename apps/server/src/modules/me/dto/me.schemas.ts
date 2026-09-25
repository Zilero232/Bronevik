import { accountIdSchema, uuidSchema } from '@bronevik/schemas';
import { z } from 'zod';

export const idParamsSchema = z.object({
  id: uuidSchema
});

export const lestaAccountParamsSchema = z.object({
  accountId: accountIdSchema
});
