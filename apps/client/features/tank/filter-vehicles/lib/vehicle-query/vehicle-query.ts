import { createLoader } from 'nuqs/server';

import type { VehicleFilterValues } from '../../model/hooks';

import { PREMIUM_VALUE, VEHICLE_FILTER_PARSERS } from '../../config';

export const loadVehicleFilters = createLoader(VEHICLE_FILTER_PARSERS);

export const vehicleQuery = ({ tiers, types, nations, premium }: VehicleFilterValues) => ({ tiers, types, nations, premium: PREMIUM_VALUE[premium] });
