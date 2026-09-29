import type { PlayerTankRow } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import type { TankNation } from '../top-nation.types';

import { topNation } from '../top-nation';

const row = ({ nation, battles }: { nation: TankNation; battles: number }): PlayerTankRow => ({
  vehicle: {
    tankId: 1,
    name: 'Tank',
    shortName: 'T',
    slug: 'tank',
    nation,
    type: 'heavyTank',
    tier: 10,
    isPremium: false,
    isCollectible: false,
    status: 'researchable',
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

describe('topNation', () => {
  it('returns the nation with the most battles', () => {
    expect(
      topNation([row({ nation: 'ussr', battles: 300 }), row({ nation: 'germany', battles: 250 }), row({ nation: 'germany', battles: 100 })])
    ).toBe('germany');
  });

  it('returns null without battles', () => {
    expect(topNation([])).toBeNull();
    expect(topNation([row({ nation: 'usa', battles: 0 })])).toBeNull();
  });
});
