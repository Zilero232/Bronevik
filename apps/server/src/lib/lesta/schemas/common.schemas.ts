import { z } from 'zod';

export const lestaMetaSchema = z.looseObject({
  count: z.number().nullish(),
  page_total: z.number().nullish(),
  total: z.number().nullish(),
  limit: z.number().nullish(),
  page: z.number().nullish()
});

const lestaErrorBodySchema = z.object({
  code: z.number().optional(),
  message: z.string(),
  field: z.string().nullish(),
  value: z.union([z.string(), z.number()]).nullish()
});

export const lestaEnvelopeSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('ok'), meta: lestaMetaSchema.optional(), data: z.unknown() }),
  z.object({ status: z.literal('error'), error: lestaErrorBodySchema })
]);

export const looseMapSchema = z.record(z.string(), z.unknown());

export const idMapOf = <T extends z.ZodType>(value: T) => z.record(z.string(), value.nullable());
