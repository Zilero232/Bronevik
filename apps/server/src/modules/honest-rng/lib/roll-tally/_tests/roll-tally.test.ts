import { HONEST_RNG } from '@otmetki/schemas';
import { sumBy } from 'remeda';
import { describe, expect, it } from 'vitest';

import type { StoredShot } from '../../../../analytics';

import { emptyTally, foldBattle, tallySummary } from '../roll-tally';

const shot = (damage: number, overrides: Partial<StoredShot> = {}): StoredShot => ({
  damage,
  nominal: 400,
  shell: 'armor_piercing',
  outcome: 'damage',
  distance: 200,
  fatal: false,
  ...overrides
});

describe('foldBattle', () => {
  it('counts only rolls that qualify and every battle and player once', () => {
    const tally = emptyTally();

    foldBattle({ tally, accountId: '1', shots: [shot(400), shot(0, { outcome: 'miss' }), shot(150, { fatal: true })], accuracy: null });
    foldBattle({ tally, accountId: '1', shots: [shot(460)], accuracy: { fired: 4, hit: 3, pierced: 2 } });

    const summary = tallySummary(tally);

    expect(summary.battles).toBe(2);
    expect(summary.players).toBe(1);
    expect(summary.shots).toBe(2);
    expect(sumBy(summary.buckets, (bucket) => bucket.shots)).toBe(summary.shots);
    expect(summary.meanRoll).toBeCloseTo((400 + 460) / 800 - 1, 6);
    expect(summary.hitRate).toBeCloseTo(75, 6);
  });

  it('matches a single summary when folding battle by battle', () => {
    const shots = [shot(310), shot(390), shot(420), shot(499), shot(305, { shell: 'high_explosive' })];
    const folded = shots.reduce((tally, item, index) => foldBattle({ tally, accountId: String(index), shots: [item], accuracy: null }), emptyTally());
    const whole = foldBattle({ tally: emptyTally(), accountId: '0', shots, accuracy: null });

    expect(tallySummary(folded).buckets.map((bucket) => bucket.shots)).toEqual(tallySummary(whole).buckets.map((bucket) => bucket.shots));
    expect(tallySummary(folded).meanRoll).toBeCloseTo(tallySummary(whole).meanRoll ?? 0, 9);
  });

  it('reports no rates and no mean without data', () => {
    const summary = tallySummary(emptyTally());

    expect(summary.meanRoll).toBeNull();
    expect(summary.hitRate).toBeNull();
    expect(summary.buckets).toHaveLength(HONEST_RNG.buckets);
  });
});
