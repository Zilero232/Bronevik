import { z } from 'zod';

import { tankIdSchema } from '../common/primitives/primitives.schemas';
import { booleanParam, listParam } from '../common/query/query.schemas';

export const vehicleTypeSchema = z.enum(['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG']);

export const tierSchema = z.coerce.number().int().min(1).max(11);

export const nationSchema = z.string().min(1).max(32);

export const vehicleImagesSchema = z.object({
  small: z.url().nullable(),
  contour: z.url().nullable(),
  big: z.url().nullable()
});

export const vehicleSummarySchema = z.object({
  tankId: tankIdSchema,
  name: z.string(),
  shortName: z.string(),
  slug: z.string(),
  nation: nationSchema,
  type: vehicleTypeSchema,
  tier: tierSchema,
  isPremium: z.boolean(),
  isCollectible: z.boolean(),
  images: vehicleImagesSchema
});

export const vehicleFilterSchema = z.object({
  tiers: listParam(tierSchema).optional(),
  types: listParam(vehicleTypeSchema).optional(),
  nations: listParam(nationSchema).optional(),
  premium: booleanParam.optional(),
  collectible: booleanParam.optional()
});

export const vehicleCatalogSchema = z.array(vehicleSummarySchema);
