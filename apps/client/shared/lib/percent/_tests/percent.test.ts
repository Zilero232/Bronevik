import { describe, expect, it } from 'vitest';

import type { PercentFormatter } from '../percent.types';

import { percentText } from '../percent';
import { PERCENT_TEXT } from '../percent.constants';

const formatter = (locale: string): PercentFormatter => ({
  number: (value, options) =>
    new Intl.NumberFormat(locale, {
      style: typeof options === 'object' ? options.style : undefined,
      maximumFractionDigits: typeof options === 'object' ? options.maximumFractionDigits : undefined
    }).format(value)
});

describe('percentText', () => {
  it('prints a 0–100 rate as a percent without scaling a small value up', () => {
    expect(percentText({ format: formatter('en'), value: 0.5 })).toBe('0.5%');
    expect(percentText({ format: formatter('en'), value: 56.34 })).toBe('56.3%');
  });

  it('follows the locale spacing and decimal comma', () => {
    expect(percentText({ format: formatter('ru'), value: 54.21, digits: 2 })).toBe('54,21 %');
  });

  it('prints the placeholder for a missing rate', () => {
    expect(percentText({ format: formatter('en'), value: null })).toBe(PERCENT_TEXT.empty);
  });
});
