import { describe, expect, it } from 'vitest';

import { barFill } from '../hud-bar';

describe(barFill, () => {
  it('fills the bar by the share and clamps it', () => {
    expect(barFill({ value: 50, max: 100, width: 40 })).toBe(20);
    expect(barFill({ value: 500, max: 100, width: 40 })).toBe(40);
    expect(barFill({ value: 5, max: 0, width: 40 })).toBe(0);
  });
});
