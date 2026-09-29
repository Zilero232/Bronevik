import { describe, expect, it } from 'vitest';

import { loadVehicleFilters } from '@/features/tank/filter-vehicles';

import type { StatsParamsInput } from '../stats-params.types';

import { TANKS_VIEW } from '../../../config';
import { statsParams } from '../stats-params';

const state: StatsParamsInput['state'] = { period: '7d', cohort: 'all', mode: 'all', statuses: [], difficulties: [], top: false };

const filters = loadVehicleFilters(new URLSearchParams());

describe('statsParams', () => {
  it('asks for the full list by default', () => {
    expect(statsParams({ state, filters })).toMatchObject({ limit: TANKS_VIEW.statsLimit });
  });

  it('asks the server for its best tanks when the top preset is on', () => {
    expect(statsParams({ state: { ...state, top: true }, filters })).toMatchObject(TANKS_VIEW.top);
  });

  it('passes the battle mode and the shared role filter through', () => {
    expect(statsParams({ state: { ...state, mode: 'ranked' }, filters: { ...filters, roles: ['HT_break'] } })).toMatchObject({
      mode: 'ranked',
      roles: ['HT_break']
    });
  });
});
