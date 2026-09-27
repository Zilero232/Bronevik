import { describe, expect, it } from 'vitest';

import { BOARD_ICON_KINDS } from '../../../config';
import { iconGlyph } from '../icon-glyph';

const SIZE = 30;

describe('iconGlyph', () => {
  it('stays inside the icon box for every kind', () => {
    for (const kind of BOARD_ICON_KINDS) {
      const { outline } = iconGlyph({ kind, size: SIZE });

      expect(outline.length % 2).toBe(0);
      expect(Math.max(...outline.map(Math.abs))).toBeLessThanOrEqual(SIZE / 2);
    }
  });

  it('marks heavier tank classes with more bands', () => {
    const bands = (['lightTank', 'mediumTank', 'heavyTank'] as const).map((kind) => iconGlyph({ kind, size: SIZE }).lines.length);

    expect(bands).toEqual([0, 1, 2]);
  });

  it('keeps tank bands inside the rhombus', () => {
    const [band] = iconGlyph({ kind: 'mediumTank', size: SIZE }).lines;
    const [x1 = 0, , x2 = 0] = band ?? [];

    expect(Math.abs(x1)).toBeLessThan(SIZE * 0.36);
    expect(Math.abs(x2)).toBeLessThan(SIZE * 0.36);
  });

  it('draws the marker as an open ring', () => {
    expect(iconGlyph({ kind: 'marker', size: SIZE }).isFilled).toBe(false);
  });
});
