import { describe, expect, it } from 'vitest';

import { goalProgress } from '../goal-progress';

describe('goalProgress', () => {
  it('starts at zero on the baseline', () => {
    expect(goalProgress({ baseline: 60, target: 65, current: 60 })).toBe(0);
  });

  it('reaches one on the target', () => {
    expect(goalProgress({ baseline: 60, target: 65, current: 65 })).toBe(1);
  });

  it('measures the share of the way covered', () => {
    expect(goalProgress({ baseline: 1_000, target: 2_000, current: 1_250 })).toBeCloseTo(0.25);
  });

  it('never drops below zero when the player slid back', () => {
    expect(goalProgress({ baseline: 60, target: 65, current: 58 })).toBe(0);
  });

  it('never overshoots one', () => {
    expect(goalProgress({ baseline: 60, target: 65, current: 70 })).toBe(1);
  });

  it('shows nothing until the first measurement arrives', () => {
    expect(goalProgress({ baseline: 60, target: 65, current: null })).toBe(0);
  });

  it('handles a goal whose target equals the baseline', () => {
    expect(goalProgress({ baseline: 100, target: 100, current: 100 })).toBe(1);
  });
});
