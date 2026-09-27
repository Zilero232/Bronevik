import { match } from 'ts-pattern';

import type { EconomyTableParams, TierListParams } from '../../api';
import type { ActiveViewParamsInput, EconomyParamsInput, TierListParamsInput } from './view-params.types';

import { TANKS_ECONOMY } from '../../config';

export const tierListParams = ({ state: { period, tier }, filters: { types } }: TierListParamsInput): TierListParams => ({
  period,
  tier,
  type: types.length === 1 ? types[0] : undefined
});

export const economyParams = ({ state: { statuses, roles, difficulties, account }, vehicle }: EconomyParamsInput): EconomyTableParams => ({
  ...vehicle,
  statuses,
  roles,
  difficulties,
  account,
  limit: TANKS_ECONOMY.limit
});

export const activeViewParams = ({ state, filters, vehicle }: ActiveViewParamsInput) =>
  match(state.view)
    .with('tierlist', () => ({ tierList: tierListParams({ state, filters }) }))
    .with('economy', () => ({ economy: economyParams({ state, vehicle }) }))
    .with('table', () => ({}))
    .exhaustive();
