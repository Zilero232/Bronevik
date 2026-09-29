import { z } from 'zod';

export const gamefaceStatusSchema = z.object({
  restartExpected: z.boolean()
});
