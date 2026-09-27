import { entries } from 'remeda';

import type { CanvasPalette } from '../../model/board-tools.types';
import type { PaletteSource } from './canvas-palette.types';

import { CANVAS_FALLBACK, CANVAS_TOKENS } from '../../config';

export const readCanvasPalette = (source: PaletteSource): CanvasPalette => {
  const palette: CanvasPalette = { ...CANVAS_FALLBACK };

  for (const [key, token] of entries(CANVAS_TOKENS)) {
    const value = source.getPropertyValue(token).trim();

    if (value.length > 0) {
      palette[key] = value;
    }
  }

  return palette;
};
