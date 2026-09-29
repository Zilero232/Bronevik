import type { z } from 'zod';

import type {
  catalogCategorySchema,
  catalogComponentSchema,
  catalogConflictSchema,
  catalogDependencySchema,
  catalogPresetSchema,
  catalogSchema,
  perfSchema
} from './catalog.schemas';

export type Catalog = z.infer<typeof catalogSchema>;

export type CatalogCategory = z.infer<typeof catalogCategorySchema>;

export type CatalogComponent = z.infer<typeof catalogComponentSchema>;

export type CatalogDependency = z.infer<typeof catalogDependencySchema>;

export type CatalogPreset = z.infer<typeof catalogPresetSchema>;

export type CatalogConflict = z.infer<typeof catalogConflictSchema>;

export type Perf = z.infer<typeof perfSchema>;
