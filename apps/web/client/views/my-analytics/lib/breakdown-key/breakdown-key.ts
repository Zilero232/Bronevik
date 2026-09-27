import type { VehicleType } from '@otmetki/schemas';

import { vehicleTypeSchema } from '@otmetki/schemas';

export const vehicleClassOf = (value: string): VehicleType | null => vehicleTypeSchema.safeParse(value).data ?? null;
