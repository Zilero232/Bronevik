import type { PlayerTankRow } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { favoriteKinds } from '../favorite-kinds';

type RowInput = Pick<PlayerTankRow['vehicle'], 'nation' | 'type'> & { battles: number };

const row = ({ nation, type, battles }: RowInput): PlayerTankRow => ({
  vehicle: {
    tankId: battles,
    name: 'Tank',
    shortName: 'T',
    slug: 'tank',
    nation,
    type,
    tier: 10,
    isPremium: false,
    isCollectible: false,
    images: { small: null, contour: null, big: null }
  },
  battles,
  winRate: null,
  avgDamage: null,
  avgFrags: null,
  avgXp: null,
  survivalRate: null,
  wn8: { value: null, tier: null },
  markOfMastery: 0,
  marksOnGun: null,
  moePercent: null,
  damagePercentile: null,
  maxFrags: null,
  maxXp: null,
  lastBattleAt: null,
  recent: null
});

describe('favoriteKinds', () => {
  it('picks the nation and class with the most battles and their share', () => {
    const rows = [
      row({ nation: 'ussr', type: 'heavyTank', battles: 10 }),
      row({ nation: 'germany', type: 'mediumTank', battles: 60 }),
      row({ nation: 'ussr', type: 'mediumTank', battles: 30 })
    ];

    expect(favoriteKinds(rows)).toEqual({
      nation: { value: 'germany', share: 0.6 },
      tankClass: { value: 'mediumTank', share: 0.9 }
    });
  });

  it('is empty without battles', () => {
    expect(favoriteKinds([row({ nation: 'ussr', type: 'heavyTank', battles: 0 })])).toEqual({ nation: null, tankClass: null });
  });
});
