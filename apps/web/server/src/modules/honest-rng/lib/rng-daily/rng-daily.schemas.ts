import { z } from 'zod';

export const rngWatermarkSchema = z.object({
  receivedAt: z.coerce.date(),
  id: z.string()
});
