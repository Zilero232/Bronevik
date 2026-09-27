import { z } from 'zod';

export const appInfoSchema = z.object({
  version: z.string(),
  stateRoot: z.string(),
  roamingRoot: z.string(),
  logsDir: z.string(),
  apiUrl: z.string()
});
