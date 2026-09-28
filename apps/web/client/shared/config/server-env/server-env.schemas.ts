import { z } from 'zod';

export const serverEnvSchema = z.object({
  INTERNAL_API_TOKEN: z.string().min(32)
});
