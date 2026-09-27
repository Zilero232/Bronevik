import { describe, expect, it } from 'vitest';

import { ownedProvinces } from '../clan-provinces';

const province = {
  province_id: 'TA_12',
  province_name: 'Кёнигсберг',
  front_id: 'season_front',
  arena_id: '05_prohorovka',
  prime_time: '19:00',
  daily_revenue: 350
};

describe('ownedProvinces', () => {
  it('maps a province of the payload to its stored fields', () => {
    expect(ownedProvinces([province])).toEqual([
      { provinceId: 'TA_12', frontId: 'season_front', name: 'Кёнигсберг', arenaId: '05_prohorovka', primeTime: '19:00', dailyRevenue: 350 }
    ]);
  });

  it('stores missing optional fields as null', () => {
    expect(ownedProvinces([{ province_id: 'TA_1', province_name: 'A', front_id: 'f' }])).toEqual([
      { provinceId: 'TA_1', frontId: 'f', name: 'A', arenaId: null, primeTime: null, dailyRevenue: null }
    ]);
  });

  it('reads a null payload as a clan that owns nothing', () => {
    expect(ownedProvinces(null)).toEqual([]);
  });

  it('refuses a malformed payload instead of clearing the provinces', () => {
    expect(ownedProvinces({ province_id: 'TA_1' })).toBeNull();
    expect(ownedProvinces(undefined)).toBeNull();
  });
});
