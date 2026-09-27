import type { VehicleSummary } from '@otmetki/schemas';

export type SimilarTanksInput = {
  catalog: readonly VehicleSummary[];
  vehicle: VehicleSummary;
  limit: number;
};
