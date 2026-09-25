import { describe, expect, it } from 'vitest';

import { laurelBranches } from '../laurel';

const CIRCLE = { cx: 12, cy: 12, radius: 8.4 } as const;

const points = (path: string) => [...path.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map(([, x, y]) => ({ x: Number(x), y: Number(y) }));

describe('laurelBranches', () => {
  it('grows the requested number of leaves on each branch', () => {
    const { left, right } = laurelBranches({ ...CIRCLE, leaves: 6 });

    expect(left.leaves).toHaveLength(6);
    expect(right.leaves).toHaveLength(6);
  });

  it('mirrors the right branch across the vertical axis', () => {
    const { left, right } = laurelBranches({ ...CIRCLE, leaves: 5 });

    left.leaves.forEach((leaf, index) => {
      const byHeight = (a: { y: number }, b: { y: number }) => a.y - b.y;
      const mirrored = points(right.leaves[index]).sort(byHeight);

      points(leaf)
        .sort(byHeight)
        .forEach(({ x, y }, point) => {
          expect(mirrored[point].x).toBeCloseTo(2 * CIRCLE.cx - x, 0);
          expect(mirrored[point].y).toBeCloseTo(y, 1);
        });
    });
  });

  it('keeps every leaf inside the icon canvas', () => {
    const { left, right } = laurelBranches({ ...CIRCLE, leaves: 7 });

    [...left.leaves, ...right.leaves].flatMap(points).forEach(({ x, y }) => {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(24);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(24);
    });
  });

  it('keeps the left branch on the left half', () => {
    const { left } = laurelBranches({ ...CIRCLE, leaves: 6 });

    left.leaves.forEach((leaf) => expect(Math.min(...points(leaf).map(({ x }) => x))).toBeLessThan(CIRCLE.cx));
  });
});
