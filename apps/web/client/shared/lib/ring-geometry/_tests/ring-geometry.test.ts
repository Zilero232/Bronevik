import { describe, expect, it } from 'vitest';

import { ringGeometry } from '../ring-geometry';

describe('ringGeometry', () => {
  it('clamps the ratio into the ring', () => {
    expect(ringGeometry({ value: 150, max: 100, size: 48, thickness: 4 }).ratio).toBe(1);
    expect(ringGeometry({ value: -5, max: 100, size: 48, thickness: 4 }).ratio).toBe(0);
  });

  it('returns an empty ring when the maximum is not positive', () => {
    expect(ringGeometry({ value: 10, max: 0, size: 48, thickness: 4 }).ratio).toBe(0);
  });

  it('keeps the stroke inside the box', () => {
    const { radius, center } = ringGeometry({ value: 1, max: 1, size: 48, thickness: 4 });

    expect(center + radius + 4 / 2).toBe(48);
  });
});
