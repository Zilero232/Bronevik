import { describe, expect, it } from 'vitest';

import { rhombusBands } from '..';

const SHAPE = { cx: 12, cy: 12, halfWidth: 8, halfHeight: 10.5 } as const;

const vertices = (path: string) => [...path.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)].map(([, x, y]) => ({ x: Number(x), y: Number(y) }));

const diagonal = ({ x, y }: { x: number; y: number }) => (x - SHAPE.cx) / SHAPE.halfWidth - (y - SHAPE.cy) / SHAPE.halfHeight;

describe('rhombusBands', () => {
  it('draws one closed quadrilateral per band', () => {
    const bands = rhombusBands({ ...SHAPE, bands: 3, gap: 1.4 });

    expect(bands).toHaveLength(3);

    bands.forEach((band) => {
      expect(vertices(band)).toHaveLength(4);
      expect(band.endsWith('Z')).toBe(true);
    });
  });

  it('keeps a single band equal to the whole rhombus', () => {
    const [band] = rhombusBands({ ...SHAPE, bands: 1, gap: 2 });

    expect(vertices(band)).toEqual([
      { x: SHAPE.cx - SHAPE.halfWidth, y: SHAPE.cy },
      { x: SHAPE.cx, y: SHAPE.cy - SHAPE.halfHeight },
      { x: SHAPE.cx + SHAPE.halfWidth, y: SHAPE.cy },
      { x: SHAPE.cx, y: SHAPE.cy + SHAPE.halfHeight }
    ]);
  });

  it('never leaves the outline of the rhombus', () => {
    rhombusBands({ ...SHAPE, bands: 3, gap: 1.4 })
      .flatMap(vertices)
      .forEach(({ x, y }) => expect(Math.abs(x - SHAPE.cx) / SHAPE.halfWidth + Math.abs(y - SHAPE.cy) / SHAPE.halfHeight).toBeLessThanOrEqual(1.001));
  });

  it('separates neighbouring bands with a gap parallel to the backslash diagonal', () => {
    const ranges = rhombusBands({ ...SHAPE, bands: 2, gap: 1.6 }).map((band) => {
      const values = vertices(band).map(diagonal);

      return { min: Math.min(...values), max: Math.max(...values) };
    });

    expect(ranges[1].min - ranges[0].max).toBeGreaterThan(0);
  });
});
