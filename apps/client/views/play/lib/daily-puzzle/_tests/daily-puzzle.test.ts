import type { VehicleSummary } from '@otmetki/schemas';

import { addSeconds, subSeconds } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { GUESS_TANK } from '../../../config';
import { nextPuzzleAt, pickDailyTank, previousDay, puzzleDay, puzzleNumber, secondsUntilNextPuzzle } from '../daily-puzzle';

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
  images: { small: null, contour: null, big: null }
});

const CATALOG = [
  vehicle({ tankId: 1, tier: 1 }),
  vehicle({ tankId: 2, tier: 4 }),
  vehicle({ tankId: 3, tier: 8, isPremium: true }),
  ...Array.from({ length: 30 }, (_, index) => vehicle({ tankId: 100 + index, tier: 5 + (index % 6) }))
];

const DAYS = Array.from({ length: 20 }, (_, index) => `2026-10-${String(index + 1).padStart(2, '0')}`);

describe('puzzleDay', () => {
  it('rolls over at midnight Moscow time, not UTC', () => {
    const beforeMidnight = new Date(Date.UTC(2026, 8, 24, 20, 59));
    const afterMidnight = new Date(Date.UTC(2026, 8, 24, 21, 1));

    expect(puzzleDay(beforeMidnight)).not.toBe(puzzleDay(afterMidnight));
    expect(previousDay(puzzleDay(afterMidnight))).toBe(puzzleDay(beforeMidnight));
  });
});

describe('puzzleNumber', () => {
  it('counts the epoch day as the first puzzle and grows by one each day', () => {
    expect(puzzleNumber(GUESS_TANK.epoch)).toBe(1);
    expect(puzzleNumber('2026-10-02') - puzzleNumber('2026-10-01')).toBe(1);
  });
});

describe('nextPuzzleAt', () => {
  it('lands exactly on the next puzzle day', () => {
    const now = new Date(Date.UTC(2026, 8, 24, 12, 34, 56));
    const next = nextPuzzleAt(now);

    expect(previousDay(puzzleDay(next))).toBe(puzzleDay(now));
    expect(puzzleDay(subSeconds(next, 1))).toBe(puzzleDay(now));
  });
});

describe('secondsUntilNextPuzzle', () => {
  it('counts whole seconds up to Moscow midnight', () => {
    const now = new Date(Date.UTC(2026, 8, 24, 20, 59, 30));

    expect(secondsUntilNextPuzzle(now)).toBe(30);
    expect(puzzleDay(addSeconds(now, secondsUntilNextPuzzle(now)))).not.toBe(puzzleDay(now));
  });
});

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
});
