import type { Vehicle } from '../../../../../generated';
import type { CatalogEntry } from '../../reference.types';

import { toVehicleSummary } from '../vehicle-summary';

export const toCatalogEntry = (row: Vehicle): CatalogEntry => ({
  summary: toVehicleSummary(row),
  dbType: row.type,
  specs: row.specs,
  description: row.description
});
