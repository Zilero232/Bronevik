import { z } from 'zod';

import { catalogSchema } from '@/entities/catalog';
import { gameClientSchema } from '@/entities/client';
import { localizedSchema } from '@/shared/lib';

export const foreignEntrySchema = z.object({
  path: z.string(),
  name: z.string(),
  isDir: z.boolean(),
  location: z.enum(['mods', 'res_mods'])
});

export const dependencyStatusSchema = z.object({
  id: z.string(),
  state: z.enum(['missing', 'ours', 'outdated', 'user']),
  file: z.string().nullable()
});

export const installPlanSchema = z.object({
  client: gameClientSchema,
  catalog: catalogSchema.nullable(),
  release: z.object({ version: z.string(), notes: localizedSchema.nullable() }).nullable(),
  source: z.enum(['release', 'offline', 'unavailable']),
  otherMods: z.array(foreignEntrySchema),
  installed: z.boolean(),
  currentComponents: z.array(z.string()),
  parkedComponents: z.array(z.string()),
  dependencies: z.array(dependencyStatusSchema)
});
