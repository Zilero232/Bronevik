import { buildSchema, createBuildSchema, paginatedSchema, paginationQuerySchema, tankIdSchema, visibilitySchema } from '@otmetki/schemas';
import { z } from 'zod';

export const tankParamsSchema = z.object({ id: tankIdSchema });

export const buildsQuerySchema = paginationQuerySchema.extend({
  tankId: tankIdSchema.optional(),
  sort: z.enum(['popular', 'recent']).default('popular')
});

export const buildPageSchema = paginatedSchema(buildSchema);

export const buildListSchema = z.array(buildSchema);

export const updateBuildSchema = createBuildSchema.omit({ tankId: true }).extend({ visibility: visibilitySchema }).partial();

export const buildStatsSchema = z.record(z.string(), z.number().nullable());
