import { describe, expect, it } from 'vitest';

import type { CareerSource } from '../player-career.types';

import { careerRecordRefs, careerSourceFromBlock, toPlayerAssist } from '../player-career';

const empty: CareerSource = {
  avgDamageAssisted: null,
  avgDamageAssistedRadio: null,
  avgDamageAssistedTrack: null,
  avgDamageAssistedStun: null,
  maxDamage: null,
  maxDamageTankId: null,
  maxXp: null,
  maxXpTankId: null,
  maxFrags: null,
  maxFragsTankId: null
};

describe('toPlayerAssist', () => {
  it('returns null when Lesta reported no assist at all', () => {
    expect(toPlayerAssist(empty)).toBeNull();
  });

  it('keeps a zero assist, which is a real value for a heavy tank player', () => {
    expect(toPlayerAssist({ ...empty, avgDamageAssisted: 0 })).toEqual({ avgAssisted: 0, avgRadio: null, avgTrack: null, avgStun: null });
  });
});

describe('careerRecordRefs', () => {
  it('lists only records the player has, with the tank they were set on', () => {
    expect(careerRecordRefs({ ...empty, maxDamage: 8200, maxDamageTankId: 7, maxFrags: 0 })).toEqual([{ key: 'maxDamage', value: 8200, tankId: 7 }]);
  });
});

describe('careerSourceFromBlock', () => {
  it('reads the assist split and the record tanks from a Lesta block', () => {
    const source = careerSourceFromBlock({
      battles: 10,
      wins: 5,
      losses: 5,
      draws: 0,
      xp: 1,
      damage_dealt: 1,
      damage_received: 1,
      frags: 1,
      spotted: 1,
      capture_points: 0,
      dropped_capture_points: 0,
      hits: 1,
      shots: 1,
      survived_battles: 1,
      avg_damage_assisted_radio: 410.5,
      max_xp: 2100,
      max_xp_tank_id: 3
    });

    expect(source).toMatchObject({ avgDamageAssistedRadio: 410.5, avgDamageAssisted: null, maxXp: 2100, maxXpTankId: 3 });
  });
});
