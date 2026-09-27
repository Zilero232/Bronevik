import { describe, expect, it } from 'vitest';

import { changeBaseline, changeVerdict } from '../change-verdict';

describe('changeVerdict', () => {
  it('calls a shorter reload a buff because lower is better', () => {
    expect(changeVerdict({ param: 'reloadTime', from: 12.5, to: 11.8, live: null })).toBe('buff');
  });

  it('calls a wider dispersion a nerf because lower is better', () => {
    expect(changeVerdict({ param: 'dispersion', from: 0.35, to: 0.38, live: null })).toBe('nerf');
  });

  it('calls more damage a buff and less penetration a nerf', () => {
    expect(changeVerdict({ param: 'shellDamage', from: 390, to: 440, live: null })).toBe('buff');
    expect(changeVerdict({ param: 'shellPenetration', from: 268, to: 258, live: null })).toBe('nerf');
  });

  it('falls back to the live value when the announcement gives only the new value', () => {
    expect(changeVerdict({ param: 'maxHealth', from: null, to: 2100, live: 1950 })).toBe('buff');
  });

  it('prefers the announced old value over the live one', () => {
    expect(changeVerdict({ param: 'maxHealth', from: 2200, to: 2100, live: 1950 })).toBe('nerf');
  });

  it('is neutral for an unchanged value, an unknown parameter or a missing baseline', () => {
    expect(changeVerdict({ param: 'viewRange', from: 400, to: 400, live: null })).toBe('neutral');
    expect(changeVerdict({ param: null, from: 1, to: 2, live: null })).toBe('neutral');
    expect(changeVerdict({ param: 'viewRange', from: null, to: 400, live: null })).toBe('neutral');
  });
});

describe('changeBaseline', () => {
  it('uses the announced value first and the live one otherwise', () => {
    expect(changeBaseline({ from: 1, live: 2 })).toBe(1);
    expect(changeBaseline({ from: null, live: 2 })).toBe(2);
    expect(changeBaseline({ from: null, live: null })).toBeNull();
  });
});
