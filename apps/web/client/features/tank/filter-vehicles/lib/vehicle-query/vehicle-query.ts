import { createLoader } from 'nuqs/server';

import type { VehicleFilterValues, VehicleQuery } from './vehicle-query.types';

import { VEHICLE_FILTER_PARSERS } from '../../config';

export const loadVehicleFilters = createLoader(VEHICLE_FILTER_PARSERS);

export const vehicleQuery = ({ tiers, types, nations, statuses, roles }: VehicleFilterValues): VehicleQuery => ({
  tiers,
  types,
  nations,
  statuses,
  roles
});
