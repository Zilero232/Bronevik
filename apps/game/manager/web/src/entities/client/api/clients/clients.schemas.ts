import { z } from 'zod';

export const gameClientSchema = z.object({
  path: z.string(),
  version: z.string(),
  branch: z.enum(['release', 'common_test']),
  realm: z.string().nullable(),
  modsDir: z.string(),
  resModsDir: z.string(),
  packageMask: z.string(),
  problem: z.enum(['not_lesta', 'old_version']).nullable(),
  source: z.enum(['lgc', 'manual']),
  preferred: z.boolean()
});

export const clientsViewSchema = z.object({
  clients: z.array(gameClientSchema),
  selected: z.string().nullable()
});
