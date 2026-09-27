import type { VehicleCatalogItem, VehicleSummary } from '@otmetki/schemas';

export type SimilarTanksInput = {
  catalog: readonly VehicleCatalogItem[];
  vehicle: VehicleSummary;
  limit: number;
};
