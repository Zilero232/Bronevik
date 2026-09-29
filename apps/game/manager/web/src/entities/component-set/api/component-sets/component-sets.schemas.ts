import { z } from 'zod';

export const componentSetSchema = z.object({
  id: z.string(),
  name: z.string(),
  components: z.array(z.string()),
  created: z.number(),
  updated: z.number()
});

export const setsViewSchema = z.object({
  max: z.number(),
  sets: z.array(componentSetSchema)
});
