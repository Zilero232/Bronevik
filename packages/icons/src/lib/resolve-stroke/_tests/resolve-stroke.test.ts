import { describe, expect, it } from 'vitest';

import { ICON_DEFAULTS } from '../../icon';
import { resolveStroke } from '..';

describe('resolveStroke', () => {
  it('passes the stroke through when it scales with the icon', () => {
    expect(resolveStroke({ size: 48, strokeWidth: 2, absoluteStrokeWidth: false })).toBe(2);
  });

  it('keeps the rendered stroke constant when it is absolute', () => {
    const strokeWidth = 2;

    [16, 24, 48].forEach((size) => {
      const resolved = Number(resolveStroke({ size, strokeWidth, absoluteStrokeWidth: true }));

      expect((resolved * size) / ICON_DEFAULTS.viewBox).toBeCloseTo(strokeWidth);
    });
  });
});
