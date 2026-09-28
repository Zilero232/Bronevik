import { describe, expect, it } from 'vitest';

import { garageSplit } from '../garage';

describe('garageSplit', () => {
  it('splits the tanks into kept and sold ones', () => {
    expect(
      garageSplit([
        { tank_id: 1, in_garage: true },
        { tank_id: 2, in_garage: false },
        { tank_id: 3, in_garage: true }
      ])
    ).toEqual({ inGarage: [1, 3], sold: [2] });
  });

  it('returns null when Lesta ignored the token and sent no garage flag', () => {
    expect(garageSplit([{ tank_id: 1, in_garage: null }, { tank_id: 2 }])).toBeNull();
  });

  it('skips a tank without a flag instead of marking it sold', () => {
    expect(
      garageSplit([
        { tank_id: 1, in_garage: true },
        { tank_id: 2, in_garage: null }
      ])
    ).toEqual({ inGarage: [1], sold: [] });
  });
});
