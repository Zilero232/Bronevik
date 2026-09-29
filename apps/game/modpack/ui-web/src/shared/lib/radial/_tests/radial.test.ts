import { describe, expect, it } from 'vitest';

import { radialDash } from '../radial';

describe(radialDash, () => {
  it('draws the remaining share of the ring and clamps the progress', () => {
    const half = radialDash({ progress: 0.5, radius: 10 });

    expect(half.dashoffset).toBeCloseTo(half.circumference / 2, 1);
    expect(radialDash({ progress: 2, radius: 10 }).dashoffset).toBe(0);
    expect(radialDash({ progress: -1, radius: 10 }).dashoffset).toBeCloseTo(62.83, 1);
  });
});
