import { z } from 'zod';

export const snapshotPartSchema = z.object({
  name: z.enum(['mods', 'res_mods', 'configs']),
  target: z.string(),
  existed: z.boolean()
});

export const snapshotSchema = z.object({
  id: z.string(),
  date: z.string(),
  sizeBytes: z.number(),
  parts: z.array(snapshotPartSchema)
});

export const snapshotsSchema = z.array(snapshotSchema);
