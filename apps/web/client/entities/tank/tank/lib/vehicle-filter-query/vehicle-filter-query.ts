import { listParam } from '@/shared/api/http';

import type { VehicleFilterLists } from './vehicle-filter-query.types';

export const vehicleFilterQuery = <T extends VehicleFilterLists>({ tiers, types, nations, statuses, roles, difficulties, ...query }: T) => ({
  ...query,
  tiers: listParam(tiers),
  types: listParam(types),
  nations: listParam(nations),
  statuses: listParam(statuses),
  roles: listParam(roles),
  difficulties: listParam(difficulties)
});
