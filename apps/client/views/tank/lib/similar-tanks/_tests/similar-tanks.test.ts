import { describe, expect, it } from 'vitest';

import { similarTanks } from '../similar-tanks';

const tank = (tankId: number, overrides: object = {}) => ({
  tankId,
  name: `Tank ${tankId}`,
  shortName: `T${tankId}`,
  slug: `tank-${tankId}`,
  nation: 'ussr',
  type: 'mediumTank' as const,
  tier: 10,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null },
  ...overrides
});

describe('similarTanks', () => {
  it('keeps the same tier and class, drops the tank itself and puts its nation first', () => {
    const catalog = [tank(1), tank(2, { nation: 'germany' }), tank(3), tank(4, { tier: 9 }), tank(5, { type: 'heavyTank' })];

    expect(similarTanks({ catalog, vehicle: tank(1), limit: 5 }).map(({ tankId }) => tankId)).toEqual([3, 2]);
  });

  it('stops at the limit', () => {
    const catalog = [tank(1), tank(2), tank(3), tank(4)];

    expect(similarTanks({ catalog, vehicle: tank(1), limit: 2 })).toHaveLength(2);
  });
});
