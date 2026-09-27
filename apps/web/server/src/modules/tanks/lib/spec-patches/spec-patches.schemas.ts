import { z } from 'zod';

const specPrimitiveSchema = z.union([z.number(), z.string(), z.boolean(), z.null()]);

export const specChangesSchema = z.array(
  z.object({
    path: z.string(),
    before: specPrimitiveSchema.optional(),
    after: specPrimitiveSchema.optional()
  })
);
