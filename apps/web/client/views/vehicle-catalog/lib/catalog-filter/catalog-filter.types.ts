import type { VehicleCatalogItem } from '@otmetki/schemas';

import type { VehicleFilterValues } from '@/features/tank/filter-vehicles';

export type FilterCatalogInput = {
  catalog: readonly VehicleCatalogItem[];
  filters: VehicleFilterValues;
  search: string;
};

export type CatalogTierGroup = {
  tier: number;
  vehicles: VehicleCatalogItem[];
};
