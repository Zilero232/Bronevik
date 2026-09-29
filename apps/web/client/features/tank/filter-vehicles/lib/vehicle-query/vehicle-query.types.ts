import type { inferParserType } from 'nuqs/server';

import type { VEHICLE_FILTER_PARSERS } from '../../config';

export type VehicleFilterValues = inferParserType<typeof VEHICLE_FILTER_PARSERS>;

export type VehicleQuery = Pick<VehicleFilterValues, 'nations' | 'roles' | 'statuses' | 'tiers' | 'types'>;
