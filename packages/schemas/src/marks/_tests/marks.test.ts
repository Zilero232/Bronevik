import { describe, expect, it } from 'vitest';

import { masteryThresholdSchema, moeThresholdSchema } from '../marks.schemas';

const moe = { tankId: 1, date: '2026-09-24', source: 'bronevik', p65: 2000, p85: 2600, p95: 3100, p100: 4000 } as const;

describe('moeThresholdSchema', () => {
  it('accepts non-decreasing thresholds', () => {
    expect(moeThresholdSchema.safeParse(moe).success).toBe(true);
  });

  it('accepts a missing 100% threshold', () => {
    expect(moeThresholdSchema.safeParse({ ...moe, p100: null }).success).toBe(true);
  });

  it('rejects a higher mark with a lower threshold', () => {
    expect(moeThresholdSchema.safeParse({ ...moe, p95: moe.p85 - 1 }).success).toBe(false);
    expect(moeThresholdSchema.safeParse({ ...moe, p100: moe.p95 - 1 }).success).toBe(false);
  });
});

describe('masteryThresholdSchema', () => {
  const mastery = { tankId: 1, date: '2026-09-24', source: 'lesta', class3: 900, class2: 1200, class1: 1500, master: 1900 } as const;

  it('rejects an Ace threshold below class 1', () => {
    expect(masteryThresholdSchema.safeParse(mastery).success).toBe(true);
    expect(masteryThresholdSchema.safeParse({ ...mastery, master: mastery.class1 - 1 }).success).toBe(false);
  });
});
