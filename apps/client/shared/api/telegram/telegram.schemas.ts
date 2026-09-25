import { z } from 'zod';

export const webAppSessionSchema = z.object({
  token: z.string().min(1),
  user: z.object({ id: z.string(), name: z.string() })
});
