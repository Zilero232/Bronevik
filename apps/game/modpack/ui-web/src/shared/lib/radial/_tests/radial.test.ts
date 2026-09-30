import { describe, expect, it } from 'vitest';

import { radialDash } from '../radial';

describe(radialDash, () => {
  it('leaves the remaining share of the ring undrawn', () => {
    const half = radialDash({ progress: 0.5, radius: 10 });

    expect(half.dashoffset).toBeCloseTo(31.42, 1);
  });

  it('draws the whole ring for progress past the end', () => {
    expect(radialDash({ progress: 2, radius: 10 }).dashoffset).toBe(0);
  });

  it('draws nothing for progress before the start', () => {
    expect(radialDash({ progress: -1, radius: 10 }).dashoffset).toBeCloseTo(62.83, 1);
  });
});
