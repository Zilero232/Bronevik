import * as z from 'zod/mini';

export const reloadTimerSchema = z.object({
  left: z.number(),
  total: z.number(),
  ready: z.boolean(),
  clip: z.number(),
  in_clip: z.nullable(z.number()),
  show_bar: z.boolean(),
  show_ready: z.boolean(),
  show_clip: z.boolean()
});
