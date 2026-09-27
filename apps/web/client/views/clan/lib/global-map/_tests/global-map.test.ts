import { describe, expect, it } from 'vitest';

import type { GlobalMap } from '../global-map.types';

import { STRONGHOLD } from '../../../config';
import { globalMapSummary } from '../global-map';

const MAP: GlobalMap = {
  provincesCount: 2,
  eloRating6: 900,
  eloRating8: null,
  eloRating10: 1400,
  provinces: [
    { provinceId: 'a', name: 'A', arenaId: null, dailyRevenue: 120 },
    { provinceId: 'b', name: 'B', arenaId: null, dailyRevenue: null }
  ]
};

describe('globalMapSummary', () => {
  it('lists the ELO of every tracked tier in the configured order', () => {
    expect(globalMapSummary(MAP).elo.map(({ tier }) => tier)).toEqual([...STRONGHOLD.eloTiers]);
  });

  it('keeps a missing ELO as null rather than zero', () => {
    expect(globalMapSummary(MAP).elo.find(({ tier }) => tier === 8)?.value).toBeNull();
  });

  it('sums the revenue of provinces and skips unknown ones', () => {
    expect(globalMapSummary(MAP).revenue).toBe(MAP.provinces[0]?.dailyRevenue);
  });

  it('reports no revenue for a clan without provinces', () => {
    expect(globalMapSummary({ ...MAP, provinces: [] }).revenue).toBeNull();
  });
});
