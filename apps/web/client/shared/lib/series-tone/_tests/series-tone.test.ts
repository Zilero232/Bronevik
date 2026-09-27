import { describe, expect, it } from 'vitest';

import { seriesTone } from '../series-tone';
import { SERIES_TONES } from '../series-tone.constants';

describe('seriesTone', () => {
  it('keeps an explicit tone', () => {
    expect(seriesTone({ tone: 'good', index: 3 })).toBe('good');
  });

  it('walks the game palette by index when no tone is given', () => {
    expect(seriesTone({ index: 0 })).toBe('accent');
    expect(seriesTone({ index: 1 })).toBe('sky');
    expect(seriesTone({ index: 2 })).toBe('olive');
  });

  it('wraps around after the last colour', () => {
    expect(seriesTone({ index: SERIES_TONES.length })).toBe(SERIES_TONES[0]);
  });
});
