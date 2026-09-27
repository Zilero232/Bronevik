import { describe, expect, it } from 'vitest';

import { previousTankIds, specDiff, toProvisionType, toVehicleType, vehicleSlugs } from '../encyclopedia';

describe('toVehicleType', () => {
  it('maps the Lesta type strings onto the enum', () => {
    expect(toVehicleType('AT-SPG')).toBe('atSpg');
    expect(toVehicleType('heavyTank')).toBe('heavyTank');
    expect(toVehicleType('boat')).toBeNull();
  });
});

describe('toProvisionType', () => {
  it('rejects unknown provision kinds', () => {
    expect(toProvisionType('optionalDevice')).toBe('optionalDevice');
    expect(toProvisionType('toolbox')).toBeNull();
  });
});

describe('vehicleSlugs', () => {
  it('builds slugs from the tag and keeps them unique', () => {
    const slugs = vehicleSlugs({
      vehicles: [
        { tank_id: 1, tag: 'R04_T-34' },
        { tank_id: 2, tag: 'r04 t 34' },
        { tank_id: 3, tag: null }
      ]
    });

    expect(slugs.get(1)).toBe('r04-t-34');
    expect(slugs.get(2)).toBe('r04-t-34-2');
    expect(slugs.get(3)).toBe('tank-3');
  });
});

describe('previousTankIds', () => {
  it('reverses next_tanks into the tanks that lead to each vehicle', () => {
    const previous = previousTankIds([
      { tank_id: 1, next_tanks: { 3: 100 } },
      { tank_id: 2, next_tanks: { 3: 120 } },
      { tank_id: 3, next_tanks: null }
    ]);

    expect(previous.get(3)).toEqual([1, 2]);
    expect(previous.get(1)).toBeUndefined();
  });
});

describe('specDiff', () => {
  it('reports changed numeric leaves', () => {
    const diff = specDiff({ previous: { hp: 1000, gun: { reload: 10, name: 'x' } }, next: { hp: 1100, gun: { reload: 10, name: 'y' } } });

    expect(diff).toEqual({ hp: { from: 1000, to: 1100 } });
  });

  it('returns null when nothing numeric changed', () => {
    expect(specDiff({ previous: { hp: 1 }, next: { hp: 1 } })).toBeNull();
  });

  it('reports a new stat as coming from null', () => {
    expect(specDiff({ previous: null, next: { hp: 5 } })).toEqual({ hp: { from: null, to: 5 } });
  });
});
