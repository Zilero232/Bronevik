import { createLoader } from 'nuqs/server';

import type { VehicleFilterValues } from './vehicle-query.types';

import { VEHICLE_FILTER_PARSERS, VEHICLE_KIND_QUERY } from '../../config';

export const loadVehicleFilters = createLoader(VEHICLE_FILTER_PARSERS);

export const vehicleQuery = ({ tiers, types, nations, premium }: VehicleFilterValues) => ({ tiers, types, nations, ...VEHICLE_KIND_QUERY[premium] });

export const vehicleTraitQuery = ({ roles }: Pick<VehicleFilterValues, 'roles'>) => ({ roles });
