import { accountIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const accountParamsSchema = z.object({
  id: accountIdSchema
});
