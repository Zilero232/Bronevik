import type { vehicleFilterSchema, VehicleSummary } from '@bronevik/schemas';
import type { z } from 'zod';

import type { MasteryThreshold, MoeThreshold, Prisma, ThresholdSource, VehicleType } from '../../../generated';

export type CatalogEntry = {
  summary: VehicleSummary;
  dbType: VehicleType;
  specs: Prisma.JsonValue;
  description: string | null;
};

export type VehicleFilter = z.infer<typeof vehicleFilterSchema>;

export type ThresholdSet = {
  moe: Map<number, MoeThreshold>;
  mastery: Map<number, MasteryThreshold>;
};

export type ThresholdsAsOfInput = {
  date: Date | null;
  source?: ThresholdSource;
};

export type MoeHistoryInput = {
  tankId: number;
  from?: Date;
  to?: Date;
  source?: ThresholdSource;
};
