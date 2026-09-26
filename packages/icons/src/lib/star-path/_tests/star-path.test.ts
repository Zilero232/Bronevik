import { describe, expect, it } from 'vitest';

import { starPath } from '..';

const vertices = (path: string) => [...path.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map(([, x, y]) => ({ x: Number(x), y: Number(y) }));

describe('starPath', () => {
  it('draws two vertices per point and closes the path', () => {
    const path = starPath({ cx: 12, cy: 12, outer: 10, points: 6 });

    expect(vertices(path)).toHaveLength(12);
    expect(path.endsWith('Z')).toBe(true);
  });

  it('alternates between the outer and the inner radius', () => {
    const outer = 10;
    const inner = 4;
    const distances = vertices(starPath({ cx: 0, cy: 0, outer, inner })).map(({ x, y }) => Math.hypot(x, y));

    distances.forEach((distance, index) => expect(distance).toBeCloseTo(index % 2 === 0 ? outer : inner, 1));
  });

  it('points the first tip straight up', () => {
    const [tip] = vertices(starPath({ cx: 12, cy: 12, outer: 8 }));

    expect(tip).toEqual({ x: 12, y: 4 });
  });
});
