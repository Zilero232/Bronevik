import { describe, expect, it } from 'vitest';

import { interpolate } from '..';

const points = [
  [0, 0],
  [10, 100],
  [20, 150]
] as const;

describe('interpolate', () => {
  it('interpolates inside a segment and hits the points exactly', () => {
    expect(interpolate({ points, x: 5 })).toBe(50);
    expect(interpolate({ points, x: 10 })).toBe(100);
    expect(interpolate({ points, x: 15 })).toBe(125);
  });

  it('extends the first segment below the first point', () => {
    expect(interpolate({ points, x: -10 })).toBe(-100);
  });

  it('clamps to the last value past the end unless asked to extrapolate', () => {
    expect(interpolate({ points, x: 30 })).toBe(150);
    expect(interpolate({ points, x: 30, extrapolate: true })).toBe(200);
  });

  it('returns the upper value on a vertical segment', () => {
    const flat = [
      [0, 0],
      [0, 0.5],
      [1, 1]
    ] as const;

    expect(interpolate({ points: flat, x: 0 })).toBe(0.5);
  });
});
