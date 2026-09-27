import type { inferParserType } from 'nuqs/server';

import type { vehicleQuery } from '@/features/tank/filter-vehicles';

import type { TANKS_QUERY_PARSERS } from '../../config';

export type StatsParamsInput = {
  state: Pick<inferParserType<typeof TANKS_QUERY_PARSERS>, 'cohort' | 'difficulties' | 'period' | 'roles' | 'statuses'>;
  vehicle: ReturnType<typeof vehicleQuery>;
};
