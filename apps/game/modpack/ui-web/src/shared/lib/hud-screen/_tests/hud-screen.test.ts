import { describe, expect, it } from 'vitest';

import { designScreen, parseScale } from '../hud-screen';

const FALLBACK = { width: 1920, height: 1080 };

describe(parseScale, () => {
  it('reads the Gameface root font size as the interface scale', () => {
    expect(parseScale('1.25px')).toBe(1.25);
    expect(parseScale('2px')).toBe(2);
  });

  it('falls back to 1 for a size that is not an interface scale', () => {
    expect(parseScale('')).toBe(1);
    expect(parseScale('0px')).toBe(1);
    expect(parseScale('16px')).toBe(1);
  });
});

describe(designScreen, () => {
  it('divides the client pixels by the interface scale', () => {
    expect(designScreen({ client: { width: 3840, height: 2160 }, scale: 2, fallback: FALLBACK })).toEqual({ width: 1920, height: 1080 });
    expect(designScreen({ client: { width: 1366, height: 768 }, scale: 1, fallback: FALLBACK })).toEqual({ width: 1366, height: 768 });
  });

  it('uses the fallback without a client size', () => {
    expect(designScreen({ client: null, scale: 1, fallback: FALLBACK })).toBe(FALLBACK);
    expect(designScreen({ client: { width: 0, height: 0 }, scale: 1, fallback: FALLBACK })).toBe(FALLBACK);
  });
});
