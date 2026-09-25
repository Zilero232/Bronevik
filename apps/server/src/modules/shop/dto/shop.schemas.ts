import {
  bonusCodeSchema,
  bonusCodeStatusSchema,
  booleanParam,
  isoDateTimeSchema,
  paginatedSchema,
  paginationQuerySchema,
  premiumOfferSchema,
  tankIdSchema,
  uuidSchema
} from '@bronevik/schemas';
import { z } from 'zod';

export const offersQuerySchema = paginationQuerySchema.extend({
  active: booleanParam.optional(),
  tankId: tankIdSchema.optional()
});

export const offerPageSchema = paginatedSchema(premiumOfferSchema);

export const offerArchiveQuerySchema = z.object({
  tankId: tankIdSchema.optional()
});

export const offerArchiveItemSchema = z.object({
  tankId: tankIdSchema,
  tankName: z.string().nullable(),
  timesSeen: z.number().int().nonnegative(),
  lastSeenAt: isoDateTimeSchema.nullable(),
  lastDiscountPercent: z.number().int().min(0).max(100).nullable(),
  medianIntervalDays: z.number().nonnegative().nullable(),
  nextExpectedAt: isoDateTimeSchema.nullable()
});

export const offerArchiveSchema = z.array(offerArchiveItemSchema);

export const bonusCodesQuerySchema = z.object({
  status: bonusCodeStatusSchema.optional()
});

export const bonusCodeListSchema = z.array(bonusCodeSchema);

export const newsKindSchema = z.enum(['news', 'patch_notes', 'dev_blog']);

export const newsQuerySchema = paginationQuerySchema.extend({
  kind: newsKindSchema.optional(),
  tankId: tankIdSchema.optional()
});

export const newsItemSchema = z.object({
  id: uuidSchema,
  source: z.string(),
  url: z.url(),
  kind: newsKindSchema,
  title: z.string(),
  summary: z.string().nullable(),
  image: z.string().nullable(),
  tankIds: z.array(tankIdSchema),
  gameVersion: z.string().nullable(),
  publishedAt: isoDateTimeSchema
});

export const newsPageSchema = paginatedSchema(newsItemSchema);
