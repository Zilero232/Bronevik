import { match } from 'ts-pattern';

import { vehicleQuery, vehicleTraitQuery } from '@/features/tank/filter-vehicles';

import type { EconomyTableQueryInput, TierListQueryInput } from '../../api';
import type { ActiveViewParamsInput, EconomyParamsInput, TierListParamsInput } from './view-params.types';

import { TANKS_ECONOMY } from '../../config';

export const tierListParams = ({ state: { period, tier, mode }, filters: { types } }: TierListParamsInput): TierListQueryInput => ({
  period,
  mode,
  tier,
  type: types.length === 1 ? types[0] : undefined
});

export const economyParams = ({ state: { statuses, difficulties, account }, filters }: EconomyParamsInput): EconomyTableQueryInput => ({
  ...vehicleQuery(filters),
  ...vehicleTraitQuery(filters),
  statuses,
  difficulties,
  account,
  limit: TANKS_ECONOMY.limit
});

export const activeViewParams = ({ state, filters }: ActiveViewParamsInput) =>
  match(state.view)
    .with('tierlist', () => ({ tierList: tierListParams({ state, filters }) }))
    .with('economy', () => ({ economy: economyParams({ state, filters }) }))
    .with('table', () => ({}))
    .exhaustive();
