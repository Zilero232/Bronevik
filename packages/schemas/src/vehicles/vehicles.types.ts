import type { z } from 'zod';

import type { vehicleCatalogSchema, vehicleFilterSchema, vehicleImagesSchema, vehicleSummarySchema, vehicleTypeSchema } from './vehicles.schemas';

export type VehicleType = z.infer<typeof vehicleTypeSchema>;
export type VehicleImages = z.infer<typeof vehicleImagesSchema>;
export type VehicleSummary = z.infer<typeof vehicleSummarySchema>;
export type VehicleFilter = z.infer<typeof vehicleFilterSchema>;
export type VehicleCatalog = z.infer<typeof vehicleCatalogSchema>;
