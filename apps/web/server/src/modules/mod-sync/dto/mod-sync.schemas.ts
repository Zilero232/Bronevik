import { modComponentSetSchema, modSyncProfileSchema, modSyncTombstoneSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const storedSetsSchema = z.object({
  items: z.array(modComponentSetSchema),
  deleted: z.array(modSyncTombstoneSchema)
});

export const storedProfilesSchema = z.object({
  items: z.array(modSyncProfileSchema),
  deleted: z.array(modSyncTombstoneSchema)
});
