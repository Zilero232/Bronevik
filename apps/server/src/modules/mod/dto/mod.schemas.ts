import { z } from 'zod';

export const deviceParamsSchema = z.object({
  id: z.string().min(1).max(64)
});
