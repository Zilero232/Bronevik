import { describe, expect, it } from 'vitest';

import { entityId } from '../entity-id';

describe('entityId', () => {
  it('uses the account id for players', () => {
    expect(
      entityId({ kind: 'player', accountId: 7, nickname: 'x', clanTag: null, matchedNickname: null, wn8: { value: null, tier: null }, battles: null })
    ).toBe(7);
  });

  it('uses the tank id for tanks', () => {
    expect(
      entityId({
        kind: 'tank',
        vehicle: {
          tankId: 42,
          name: 'T',
          shortName: 'T',
          slug: 't',
          nation: 'ussr',
          type: 'heavyTank',
          tier: 10,
          isPremium: false,
          isCollectible: false,
          images: { small: null, contour: null, big: null }
        }
      })
    ).toBe(42);
  });
});
