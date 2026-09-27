import { z } from 'zod';

export const deepLinkSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('open') }),
  z.object({ kind: z.literal('profile'), code: z.string() }),
  z.object({ kind: z.literal('install'), preset: z.string().nullable() })
]);
