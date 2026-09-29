import { modpackReleaseSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const modpackReleaseManifestSchema = z.object({
  version: modpackReleaseSchema.shape.version,
  otmetki: modpackReleaseSchema.pick({ games: true }).strict()
});
