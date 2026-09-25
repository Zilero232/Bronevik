import { describe, expect, it } from 'vitest';

import { specBest, specDelta } from '../spec-rank';

describe('specBest', () => {
  it('picks the highest value for a stat where more is better', () => {
    expect(specBest({ key: 'shellDamage', values: [390, 440, null, 320] })).toBe(440);
  });

  it('picks the lowest value for a stat where less is better', () => {
    expect(specBest({ key: 'reloadTime', values: [8.6, 7.9, 9.2] })).toBe(7.9);
  });

  it('crowns nobody when every tank has the same value', () => {
    expect(specBest({ key: 'viewRange', values: [400, 400] })).toBeNull();
  });

  it('crowns nobody when fewer than two tanks carry the stat', () => {
    expect(specBest({ key: 'viewRange', values: [400, null, undefined] })).toBeNull();
  });
});

describe('specDelta', () => {
  it('calls a shorter reload an improvement', () => {
    expect(specDelta({ key: 'reloadTime', before: 8, after: 7.2 })).toBe('better');
  });

  it('calls a lower damage a regression', () => {
    expect(specDelta({ key: 'shellDamage', before: 440, after: 390 })).toBe('worse');
  });

  it('treats a missing side as no change', () => {
    expect(specDelta({ key: 'shellDamage', before: null, after: 390 })).toBe('same');
  });
});
