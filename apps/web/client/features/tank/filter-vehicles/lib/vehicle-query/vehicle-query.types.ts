import type { inferParserType } from 'nuqs/server';

import type { VEHICLE_FILTER_PARSERS, VEHICLE_KINDS } from '../../config';

export type VehicleKind = (typeof VEHICLE_KINDS)[number];

export type VehicleFilterValues = inferParserType<typeof VEHICLE_FILTER_PARSERS>;
