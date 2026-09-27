import type { inferParserType } from 'nuqs/server';

import type { vehicleQuery } from '@/features/tank/filter-vehicles';

import type { MARKS_URL_PARSERS } from '../../config';

export type MoeFeedParamsInput = Pick<inferParserType<typeof MARKS_URL_PARSERS>, 'order' | 'sort'> & {
  vehicle: ReturnType<typeof vehicleQuery>;
};
