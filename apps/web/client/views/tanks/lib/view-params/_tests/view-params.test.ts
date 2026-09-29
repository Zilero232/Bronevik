import { describe, expect, it } from 'vitest';

import { loadVehicleFilters } from '@/features/tank/filter-vehicles';

import type { ActiveViewParamsInput } from '../view-params.types';

import { activeViewParams, economyParams, tierListParams } from '../view-params';

const state: ActiveViewParamsInput['state'] = {
  period: '7d',
  cohort: 'all',
  mode: 'all',
  view: 'table',
  tier: 10,
  difficulties: [],
  top: false,
  pinned: false,
  account: 'premium',
  reserve: false,
  clanPayout: false
};

const filters = loadVehicleFilters(new URLSearchParams());

describe('tierListParams', () => {
  it('narrows to a vehicle type only when exactly one is picked', () => {
    expect(tierListParams({ state, filters: { types: ['heavyTank'] } })).toEqual({ period: '7d', mode: 'all', tier: 10, type: 'heavyTank' });
    expect(tierListParams({ state, filters: { types: ['heavyTank', 'SPG'] } })).toEqual({ period: '7d', mode: 'all', tier: 10, type: undefined });
  });

  it('asks for the chosen battle mode', () => {
    expect(tierListParams({ state: { ...state, mode: 'ranked' }, filters })).toHaveProperty('mode', 'ranked');
  });
});

describe('economyParams', () => {
  it('sends the shared role filter to the economy table', () => {
    expect(economyParams({ state, filters: { ...filters, roles: ['LT_wheeled'] } })).toHaveProperty('roles', ['LT_wheeled']);
  });
});

describe('activeViewParams', () => {
  it('prefetches nothing extra for the table', () => {
    expect(activeViewParams({ state, filters })).toEqual({});
  });

  it('picks the tier list or the economy table for their views', () => {
    expect(activeViewParams({ state: { ...state, view: 'tierlist' }, filters })).toHaveProperty('tierList');
    expect(activeViewParams({ state: { ...state, view: 'economy' }, filters })).toHaveProperty('economy.limit');
  });
});
