import { modpackManagerReleaseSchema, modpackReleaseSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const modpackReleaseManifestSchema = z.object({
  version: modpackReleaseSchema.shape.version,
  otmetki: modpackReleaseSchema.pick({ games: true }).strict()
});

export const managerReleaseManifestSchema = modpackManagerReleaseSchema.pick({ version: true });
