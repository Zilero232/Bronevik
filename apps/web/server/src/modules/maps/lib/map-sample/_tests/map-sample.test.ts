import { TANK_MAPS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { toMapSample } from '../map-sample';

describe('toMapSample', () => {
  it('shows the rates once the sample reaches the minimum', () => {
    const sample = toMapSample({ battles: TANK_MAPS.minBattles, wins: TANK_MAPS.minBattles / 2, avgDamage: 2_345.6 });

    expect(sample).toMatchObject({ battles: TANK_MAPS.minBattles, isEnough: true, avgDamage: 2_346 });
    expect(sample.winRate).toBeCloseTo(50);
  });

  it('keeps the sample size but hides the rates one battle below the minimum', () => {
    expect(toMapSample({ battles: TANK_MAPS.minBattles - 1, wins: 10, avgDamage: 3_000 })).toEqual({
      battles: TANK_MAPS.minBattles - 1,
      isEnough: false,
      winRate: null,
      avgDamage: null
    });
  });
});
