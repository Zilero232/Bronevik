import { z } from 'zod';

export const progressionTreeSchema = z.object({
  name: z.string(),
  id: z.number(),
  rootStep: z.number().default(1),
  steps: z.array(
    z.object({
      id: z.number(),
      level: z.number(),
      priceKey: z.string().optional(),
      action: z.object({ type: z.string(), value: z.string() }),
      unlocks: z.array(z.number()).default([]),
      minVehicleLevel: z.number().optional(),
      maxVehicleLevel: z.number().optional()
    })
  )
});

export const modificationPairSchema = z.object({
  name: z.string(),
  id: z.number(),
  first: z.string(),
  second: z.string(),
  priceKey: z.string().optional()
});
