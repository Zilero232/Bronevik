import type { inferParserType } from 'nuqs/server';

import type { VehicleFilterValues } from '@/features/tank/filter-vehicles';

import type { TANKS_QUERY_PARSERS } from '../../config';

type TanksState = inferParserType<typeof TANKS_QUERY_PARSERS>;

export type TierListParamsInput = {
  state: Pick<TanksState, 'mode' | 'period' | 'tier'>;
  filters: Pick<VehicleFilterValues, 'types'>;
};

export type EconomyParamsInput = {
  state: Pick<TanksState, 'account' | 'difficulties'>;
  filters: VehicleFilterValues;
};

export type ActiveViewParamsInput = {
  state: TanksState;
  filters: VehicleFilterValues;
};
