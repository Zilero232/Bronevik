import { z } from 'zod';

import { tankIdSchema } from '../common/primitives/primitives.schemas';
import { booleanParam, listParam } from '../common/query/query.schemas';
import { TANK_ROLES } from '../tanks/insights/insights.constants';

export const vehicleTypeSchema = z.enum(['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG']);

export const tierSchema = z.coerce.number().int().min(1).max(11);

export const nationSchema = z.string().min(1).max(32);

export const tankRoleSchema = z.enum(TANK_ROLES);

export const vehicleImagesSchema = z.object({
  small: z.url().nullable(),
  contour: z.url().nullable(),
  big: z.url().nullable(),
  large: z
    .url()
    .nullable()
    .optional()
    .describe('600×450 render from the Lesta client assets for large displays; fall back to `big` when it is missing or fails to load')
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

export const vehicleCatalogItemSchema = vehicleSummarySchema.extend({
  role: tankRoleSchema.nullable().describe('Battle role from the game client, null when the vehicle has none')
});

export const vehicleCatalogSchema = z.array(vehicleCatalogItemSchema);
