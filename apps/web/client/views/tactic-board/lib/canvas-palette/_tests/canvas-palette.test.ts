import { describe, expect, it } from 'vitest';

import { CANVAS_FALLBACK, CANVAS_TOKENS } from '../../../config';
import { readCanvasPalette } from '../canvas-palette';

describe('readCanvasPalette', () => {
  it('reads each colour from its theme token', () => {
    const palette = readCanvasPalette({ getPropertyValue: (name) => (name === CANVAS_TOKENS.ally ? ' #00ff00 ' : '#123456') });

    expect(palette.ally).toBe('#00ff00');
    expect(palette.enemy).toBe('#123456');
  });

  it('falls back when a token is not defined', () => {
    expect(readCanvasPalette({ getPropertyValue: () => '' })).toEqual(CANVAS_FALLBACK);
  });
});
