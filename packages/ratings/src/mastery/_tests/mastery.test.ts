import { describe, expect, it } from 'vitest';

import { MASTERY_LEVELS, MASTERY_PERCENTILES, masteryCounts, masteryForXp, masteryLevel, masteryThresholds } from '..';

describe('mastery', () => {
  it('maps the API mark_of_mastery integer to a level', () => {
    MASTERY_LEVELS.forEach((level, index) => {
      expect(masteryLevel(index)).toBe(level);
    });

    expect(masteryLevel(99)).toBe('none');
  });

  it('counts levels', () => {
    expect(masteryCounts([4, 4, 3, 0, 1])).toEqual({ none: 1, third: 1, second: 0, first: 1, ace: 2 });
  });

  it('reads badge thresholds from a tanks/mastery percentile distribution', () => {
    const distribution = {
      [MASTERY_PERCENTILES.third]: 800,
      [MASTERY_PERCENTILES.second]: 1100,
      [MASTERY_PERCENTILES.first]: 1500,
      [MASTERY_PERCENTILES.ace]: 1900
    };

    const thresholds = masteryThresholds(distribution);

    expect(thresholds).toEqual({ third: 800, second: 1100, first: 1500, ace: 1900 });
    expect(masteryThresholds({ 50: 1 })).toBeNull();

    if (thresholds) {
      expect([500, 800, 1200, 1500, 2500].map((xp) => masteryForXp({ xp, thresholds }))).toEqual(['none', 'third', 'second', 'first', 'ace']);
    }
  });
});
