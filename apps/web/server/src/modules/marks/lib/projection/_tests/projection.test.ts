import { describe, expect, it } from 'vitest';

import { projectMarks } from '../projection';

const thresholds = { p65: 2_000, p85: 2_600, p95: 3_100, p100: null };

describe('projectMarks', () => {
  it('needs no battles for a mark already reached', () => {
    expect(projectMarks({ thresholds, currentPercent: 90, targetMarks: 2, avgDamage: 1_000 })).toBe(0);
  });

  it('returns null when the average cannot reach the target', () => {
    expect(projectMarks({ thresholds, currentPercent: 50, targetMarks: 3, avgDamage: thresholds.p95 })).toBeNull();
  });

  it('needs more battles for a higher mark at the same average', () => {
    const avgDamage = thresholds.p95 * 1.2;
    const second = projectMarks({ thresholds, currentPercent: 50, targetMarks: 2, avgDamage });
    const third = projectMarks({ thresholds, currentPercent: 50, targetMarks: 3, avgDamage });

    expect(second).not.toBeNull();
    expect(third).toBeGreaterThan(second ?? Number.POSITIVE_INFINITY);
  });

  it('needs fewer battles when the average is higher', () => {
    const slow = projectMarks({ thresholds, currentPercent: 50, targetMarks: 3, avgDamage: thresholds.p95 * 1.1 });
    const fast = projectMarks({ thresholds, currentPercent: 50, targetMarks: 3, avgDamage: thresholds.p95 * 1.5 });

    expect(fast).toBeLessThan(slow ?? 0);
  });

  it('returns null instead of throwing on inconsistent thresholds', () => {
    expect(
      projectMarks({ thresholds: { p65: 3_000, p85: 2_000, p95: 1_000, p100: null }, currentPercent: 0, targetMarks: 1, avgDamage: 5_000 })
    ).toBeNull();
  });
});
