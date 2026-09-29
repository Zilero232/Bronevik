import { MODPACK_RELEASES } from '@otmetki/schemas';
import { z } from 'zod';

export const modpackCatalogSchema = z.object({
  modpackVersion: z.string().regex(MODPACK_RELEASES.semverPattern),
  components: z.array(
    z.object({
      id: z.string(),
      kind: z.string().optional(),
      file: z.string().regex(MODPACK_RELEASES.packageFilePattern)
    })
  )
});
