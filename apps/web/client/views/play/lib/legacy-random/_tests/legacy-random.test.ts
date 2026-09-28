import { describe, expect, it } from 'vitest';

import { legacyRandom } from '..';

const take = (seed: number) => {
  const random = legacyRandom(seed);

  return Array.from({ length: 3 }, () => random());
};

describe('legacyRandom', () => {
  it('replays the exact sequence the daily puzzle used before the generator switch', () => {
    expect(take(20_260_924)).toEqual([0.538_052_198_477_089_4, 0.672_742_441_063_746_8, 0.819_570_812_862_366_4]);
  });

  it('stays inside [0, 1) and survives a zero seed', () => {
    const values = take(0);

    values.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });

    expect(new Set(values).size).toBeGreaterThan(1);
  });
});
