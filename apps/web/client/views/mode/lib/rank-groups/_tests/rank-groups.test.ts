import type { ModeRank, ModeTank, VehicleSummary } from '@otmetki/schemas';

import { MODE_RANKS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { groupByRank } from '../rank-groups';

const VEHICLE: VehicleSummary = {
  tankId: 1,
  name: 'ИС-7',
  shortName: 'ИС-7',
  slug: 'is-7',
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null }
};

const tank = (tankId: number, rank: ModeRank | null): ModeTank => ({
  vehicle: { ...VEHICLE, tankId },
  rank,
  score: null,
  battles: 1,
  players: 1,
  winRate: null,
  avgDamage: null,
  avgXp: null,
  avgFrags: null,
  survivalRate: null
});

describe('groupByRank', () => {
  it('orders groups from the best rank down and puts unranked tanks last', () => {
    const groups = groupByRank([tank(1, null), ...[...MODE_RANKS].reverse().map((rank, index) => tank(index + 2, rank))]);

    expect(groups.map(({ rank }) => rank)).toEqual([...MODE_RANKS, null]);
  });

  it('keeps the server order inside a group', () => {
    const [best] = MODE_RANKS;
    const groups = groupByRank([tank(3, best), tank(1, best), tank(2, best)]);

    expect(groups[0]?.tanks.map(({ vehicle }) => vehicle.tankId)).toEqual([3, 1, 2]);
  });

  it('drops ranks without tanks', () => {
    const [best] = MODE_RANKS;

    expect(groupByRank([tank(1, best)])).toHaveLength(1);
    expect(groupByRank([])).toEqual([]);
  });
});
