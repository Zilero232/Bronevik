import { describe, expect, it } from 'vitest';

import type { PercentFormatter } from '../percent.types';

import { percentText, pointsText } from '../percent';
import { PERCENT_TEXT } from '../percent.constants';

const format: PercentFormatter = {
  number: (value, options) =>
    new Intl.NumberFormat('en', {
      maximumFractionDigits: typeof options === 'object' ? options.maximumFractionDigits : undefined,
      signDisplay: typeof options === 'object' && options.signDisplay === 'exceptZero' ? 'exceptZero' : undefined
    }).format(value)
};

describe('percentText', () => {
  it('prints a 0–100 rate as it is, without scaling a small value up', () => {
    expect(percentText({ format, value: 0.5 })).toBe('0.5%');
    expect(percentText({ format, value: 56.34 })).toBe('56.3%');
  });

  it('prints the placeholder for a missing rate', () => {
    expect(percentText({ format, value: null })).toBe(PERCENT_TEXT.empty);
  });
});

describe('pointsText', () => {
  it('signs a positive difference and leaves zero unsigned', () => {
    expect(pointsText({ format, value: 1.25, digits: 2 })).toBe('+1.25');
    expect(pointsText({ format, value: 0 })).toBe('0');
  });
});
