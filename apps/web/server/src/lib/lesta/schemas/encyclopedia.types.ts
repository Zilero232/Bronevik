import type { z } from 'zod';

import type { encyclopediaInfoSchema, vehicleProfileSchema, vehicleSchema } from './encyclopedia.schemas';

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleProfile = z.infer<typeof vehicleProfileSchema>;
export type EncyclopediaInfo = z.infer<typeof encyclopediaInfoSchema>;
