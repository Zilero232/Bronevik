import { describe, expect, it } from 'vitest';

import type { ActiveViewParamsInput } from '../view-params.types';

import { activeViewParams, tierListParams } from '../view-params';

const vehicle: ActiveViewParamsInput['vehicle'] = { tiers: [], types: [], nations: [], premium: undefined };

const state: ActiveViewParamsInput['state'] = {
  period: '7d',
  cohort: 'all',
  view: 'table',
  tier: 10,
  statuses: [],
  roles: [],
  difficulties: [],
  account: 'premium',
  reserve: false,
  clanPayout: false
};

const filters: ActiveViewParamsInput['filters'] = { tiers: [], types: [], nations: [], premium: 'all' };

describe('tierListParams', () => {
  it('narrows to a vehicle type only when exactly one is picked', () => {
    expect(tierListParams({ state, filters: { types: ['heavyTank'] } })).toEqual({ period: '7d', tier: 10, type: 'heavyTank' });
    expect(tierListParams({ state, filters: { types: ['heavyTank', 'SPG'] } })).toEqual({ period: '7d', tier: 10, type: undefined });
  });
});

describe('activeViewParams', () => {
  it('prefetches nothing extra for the table', () => {
    expect(activeViewParams({ state, filters, vehicle })).toEqual({});
  });

  it('picks the tier list or the economy table for their views', () => {
    expect(activeViewParams({ state: { ...state, view: 'tierlist' }, filters, vehicle })).toHaveProperty('tierList');
    expect(activeViewParams({ state: { ...state, view: 'economy' }, filters, vehicle })).toHaveProperty('economy.limit');
  });
});
