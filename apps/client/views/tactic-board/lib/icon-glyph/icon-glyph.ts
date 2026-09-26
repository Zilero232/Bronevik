import type { IconGlyph, IconGlyphInput } from './icon-glyph.types';

import { BOARD_ICON_BANDS } from '../../config';

const MARKER_SEGMENTS = 16;

const rhombus = ({ kind, size }: IconGlyphInput): IconGlyph => {
  const halfWidth = size * 0.36;
  const halfHeight = size * 0.5;
  const bands = BOARD_ICON_BANDS[kind];
  const lines = Array.from({ length: bands }, (_, index) => {
    const y = halfHeight - ((index + 1) * 2 * halfHeight) / (bands + 2);
    const reach = halfWidth * (1 - Math.abs(y) / halfHeight);

    return [-reach, y, reach, y];
  });

  return { outline: [0, -halfHeight, halfWidth, 0, 0, halfHeight, -halfWidth, 0], lines, isFilled: true };
};

const marker = (size: number): IconGlyph => {
  const radius = size * 0.36;
  const outline = Array.from({ length: MARKER_SEGMENTS }, (_, index) => {
    const angle = (index / MARKER_SEGMENTS) * Math.PI * 2;

    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  }).flat();

  return {
    outline,
    lines: [
      [-radius * 1.3, 0, -radius * 0.4, 0],
      [radius * 0.4, 0, radius * 1.3, 0],
      [0, -radius * 1.3, 0, -radius * 0.4],
      [0, radius * 0.4, 0, radius * 1.3]
    ],
    isFilled: false
  };
};

export const iconGlyph = ({ kind, size }: IconGlyphInput): IconGlyph => {
  const half = size / 2;

  switch (kind) {
    case 'AT-SPG':
      return { outline: [-half * 0.8, -half * 0.6, half * 0.8, -half * 0.6, 0, half * 0.75], lines: [], isFilled: true };
    case 'SPG':
      return {
        outline: [-half * 0.62, -half * 0.62, half * 0.62, -half * 0.62, half * 0.62, half * 0.62, -half * 0.62, half * 0.62],
        lines: [],
        isFilled: true
      };
    case 'flag':
      return {
        outline: [-half * 0.55, -half, half * 0.8, -half * 0.55, -half * 0.55, -half * 0.1],
        lines: [[-half * 0.55, -half, -half * 0.55, half]],
        isFilled: true
      };
    case 'marker':
      return marker(size);
    default:
      return rhombus({ kind, size });
  }
};
