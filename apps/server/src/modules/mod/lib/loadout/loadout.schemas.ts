import { z } from 'zod';

const itemSlots = z.array(z.number().int().positive().nullable()).default([]);

export const storedLoadoutSchema = z.object({
  optionalDevices: itemSlots,
  consumables: itemSlots,
  directives: itemSlots,
  shells: z.array(z.object({ shellId: z.number().int().positive(), count: z.number().int().nonnegative() })).default([]),
  fieldModifications: z.array(z.string()).default([]),
  crew: z.array(z.object({ role: z.string(), skills: z.array(z.string()) })).default([]),
  gameplayId: z.number().int().nonnegative().nullable().default(null)
});
