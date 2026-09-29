import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { seededRandom } from '@/shared/lib';

import { GUESS_TANK } from '../../../config';
import { legacyRandom } from '../../legacy-random';
import { dailyPool, pickDailyTank } from '../daily-puzzle';

const vehicle = ({ tankId, tier, isPremium = false }: { tankId: number; tier: number; isPremium?: boolean }): VehicleSummary => ({
  tankId,
  tier,
  isPremium,
  name: `T${tankId}`,
  shortName: `T${tankId}`,
  slug: `t-${tankId}`,
  nation: 'ussr',
  type: 'heavyTank',
  isCollectible: false,
  status: 'researchable',
  images: { small: null, contour: null, big: null }
});

const CATALOG = [
  vehicle({ tankId: 1, tier: 1 }),
  vehicle({ tankId: 2, tier: 4 }),
  vehicle({ tankId: 3, tier: 8, isPremium: true }),
  ...Array.from({ length: 30 }, (_, index) => vehicle({ tankId: 100 + index, tier: 5 + (index % 6) }))
];

const DAYS = Array.from({ length: 20 }, (_, index) => `2026-10-${String(index + 1).padStart(2, '0')}`);

describe('pickDailyTank', () => {
  it('gives every player the same tank on the same day, whatever the catalog order', () => {
    expect(pickDailyTank({ vehicles: CATALOG, day: '2026-09-24' })).toEqual(pickDailyTank({ vehicles: [...CATALOG].reverse(), day: '2026-09-24' }));
  });

  it('prefers researchable tanks from the minimum tier up', () => {
    DAYS.forEach((day) => {
      const target = pickDailyTank({ vehicles: CATALOG, day });

      expect(target?.isPremium).toBe(false);
      expect(target?.tier).toBeGreaterThanOrEqual(GUESS_TANK.minTier);
    });
  });

  it('changes the tank from day to day', () => {
    const picks = new Set(DAYS.map((day) => pickDailyTank({ vehicles: CATALOG, day })?.tankId));

    expect(picks.size).toBeGreaterThan(DAYS.length / 3);
  });

  it('falls back to the whole catalog when no tank fits the preference', () => {
    const lowOnly = [vehicle({ tankId: 1, tier: 1 }), vehicle({ tankId: 2, tier: 2 })];

    expect(pickDailyTank({ vehicles: lowOnly, day: '2026-09-24' })).not.toBeNull();
  });

  it('returns nothing for an empty catalog', () => {
    expect(pickDailyTank({ vehicles: [], day: '2026-09-24' })).toBeNull();
  });

  it('keeps the tank of every day before the generator switch', () => {
    const pool = dailyPool(CATALOG);

    ['2026-09-24', '2026-09-28'].forEach((day) => {
      const seed = Number(day.replaceAll('-', ''));

      expect(pickDailyTank({ vehicles: CATALOG, day })).toBe(pool[Math.floor(legacyRandom(seed)() * pool.length)]);
    });
  });

  it('draws from the new generator from the switch day on', () => {
    const pool = dailyPool(CATALOG);
    const seed = Number(GUESS_TANK.generatorSwitchDay.replaceAll('-', ''));

    expect(pickDailyTank({ vehicles: CATALOG, day: GUESS_TANK.generatorSwitchDay })).toBe(pool[Math.floor(seededRandom(seed)() * pool.length)]);
  });
});
