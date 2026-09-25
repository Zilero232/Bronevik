import type { PlayerTankRow } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { tankHighlights } from '../tank-highlights';

const row = ({ tankId, battles, wn8 }: { tankId: number; battles: number; wn8: number | null }): PlayerTankRow => ({
  vehicle: {
    tankId,
    name: `Tank ${tankId}`,
    shortName: `T${tankId}`,
    slug: `tank-${tankId}`,
    nation: 'ussr',
    type: 'heavyTank',
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
  wn8: { value: wn8, tier: null },
  markOfMastery: 0,
  marksOnGun: null,
  moePercent: null,
  damagePercentile: null,
  maxFrags: null,
  maxXp: null,
  lastBattleAt: null,
  recent: null
});

const ROWS = [
  row({ tankId: 1, battles: 300, wn8: 3_000 }),
  row({ tankId: 2, battles: 300, wn8: 1_200 }),
  row({ tankId: 3, battles: 10, wn8: 9_000 }),
  row({ tankId: 4, battles: 300, wn8: 2_100 }),
  row({ tankId: 5, battles: 300, wn8: null }),
  row({ tankId: 6, battles: 300, wn8: 600 })
];

const ids = (rows: PlayerTankRow[]) => rows.map(({ vehicle }) => vehicle.tankId);

describe('tankHighlights', () => {
  it('ignores tanks with too few battles to judge', () => {
    const { best } = tankHighlights({ rows: ROWS, count: 2, minBattles: 50 });

    expect(ids(best)).not.toContain(3);
  });

  it('ignores tanks without a rating', () => {
    const { best, worst } = tankHighlights({ rows: ROWS, count: 5, minBattles: 50 });

    expect([...ids(best), ...ids(worst)]).not.toContain(5);
  });

  it('orders the best from the top and the worst from the bottom', () => {
    const { best, worst } = tankHighlights({ rows: ROWS, count: 2, minBattles: 50 });

    expect(ids(best)).toEqual([1, 4]);
    expect(ids(worst)).toEqual([6, 2]);
  });

  it('never lists a tank on both sides when there are few of them', () => {
    const { best, worst } = tankHighlights({ rows: ROWS.slice(0, 2), count: 3, minBattles: 50 });

    expect(ids(best).filter((id) => ids(worst).includes(id))).toEqual([]);
  });
});
