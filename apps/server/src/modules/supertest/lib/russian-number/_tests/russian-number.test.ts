import { describe, expect, it } from 'vitest';

import { parseRussianNumber } from '../russian-number';

describe('parseRussianNumber', () => {
  it('reads a decimal comma', () => {
    expect(parseRussianNumber('0,38')).toBe(0.38);
  });

  it('reads a decimal point', () => {
    expect(parseRussianNumber('2.3')).toBe(2.3);
  });

  it('joins thousands separated by regular, non-breaking and narrow spaces', () => {
    expect(parseRussianNumber('2 400')).toBe(2400);
    expect(parseRussianNumber('2 400')).toBe(2400);
    expect(parseRussianNumber('1 050,5')).toBe(1050.5);
  });

  it('reads typographic minus and en dash as a negative sign', () => {
    expect(parseRussianNumber('−8')).toBe(-8);
    expect(parseRussianNumber('–10,5')).toBe(-10.5);
  });

  it('returns null for text that is not a number', () => {
    expect(parseRussianNumber('около 10')).toBeNull();
    expect(parseRussianNumber('')).toBeNull();
  });
});
