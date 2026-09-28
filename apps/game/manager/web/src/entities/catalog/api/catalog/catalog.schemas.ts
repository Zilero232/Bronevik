import { z } from 'zod';

import { localizedSchema } from '@/shared/lib';

export const catalogCategorySchema = z.object({
  id: z.string(),
  title: localizedSchema,
  description: localizedSchema
});

export const catalogPresetSchema = z.object({
  id: z.string(),
  title: localizedSchema,
  description: localizedSchema,
  custom: z.boolean()
});

export const catalogComponentSchema = z.object({
  id: z.string(),
  packageId: z.string(),
  version: z.string(),
  file: z.string(),
  category: z.string(),
  title: localizedSchema,
  description: localizedSchema,
  fairPlay: localizedSchema,
  required: z.boolean(),
  default: z.boolean(),
  presets: z.array(z.string()),
  preview: z.object({ image: z.string().nullable(), video: z.string().nullable() }),
  dependencies: z.array(z.string()),
  catalogued: z.boolean(),
  sha256: z.string().nullable(),
  size: z.number().nullable()
});

export const catalogDependencySchema = z.object({
  id: z.string(),
  kind: z.literal('dependency'),
  packageId: z.string(),
  version: z.string(),
  file: z.string(),
  title: localizedSchema,
  description: localizedSchema,
  author: z.object({ name: z.string(), url: z.string() }),
  licence: z.object({ name: z.string(), url: z.string(), sha256: z.string() }),
  sourceUrl: z.string(),
  sha256: z.string(),
  size: z.number(),
  requiredBy: z.array(z.string()),
  restartRequired: z.boolean()
});

export const catalogSchema = z.object({
  schemaVersion: z.number(),
  modpackVersion: z.string(),
  platform: z.string(),
  extension: z.string(),
  categories: z.array(catalogCategorySchema),
  presets: z.array(catalogPresetSchema),
  components: z.array(catalogComponentSchema),
  dependencies: z.array(catalogDependencySchema),
  ownedPatterns: z.array(z.string()),
  source: z.enum(['downloaded', 'bundled']),
  previewsDir: z.string().nullable()
});
