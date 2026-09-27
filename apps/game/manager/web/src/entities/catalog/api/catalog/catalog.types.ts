import type { z } from 'zod';

import type { catalogCategorySchema, catalogComponentSchema, catalogPresetSchema, catalogSchema } from './catalog.schemas';

export type Catalog = z.infer<typeof catalogSchema>;

export type CatalogCategory = z.infer<typeof catalogCategorySchema>;

export type CatalogComponent = z.infer<typeof catalogComponentSchema>;

export type CatalogPreset = z.infer<typeof catalogPresetSchema>;
