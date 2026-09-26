import { describe, expect, it } from 'vitest';

import { formatNumber, formatNumberOr, formatPercent, formatPercentOr } from '../number-format';

describe('formatNumber', () => {
  it('returns null for missing and non-finite values', () => {
    expect(formatNumber({ value: null, locale: 'en' })).toBeNull();
    expect(formatNumber({ value: undefined, locale: 'en' })).toBeNull();
    expect(formatNumber({ value: Number.NaN, locale: 'en' })).toBeNull();
  });

  it('keeps exactly the requested fraction digits', () => {
    expect(formatNumber({ value: 1.5, locale: 'en', digits: 2 })).toBe('1.50');
  });

  it('formats zero as a number, not as missing', () => {
    expect(formatNumber({ value: 0, locale: 'en' })).toBe('0');
  });

  it('drops the group separator when grouping is off', () => {
    expect(formatNumber({ value: 12_345, locale: 'en', grouping: false })).toBe('12345');
  });
});

describe('formatPercent', () => {
  it('reads a ratio as a percentage', () => {
    expect(formatPercent({ value: 0.5, locale: 'en', digits: 0 })).toBe('50%');
  });
});

describe('fallbacks', () => {
  it('substitutes the missing marker only for missing values', () => {
    expect(formatNumberOr({ value: null, locale: 'en', missing: '—' })).toBe('—');
    expect(formatPercentOr({ value: 0, locale: 'en', digits: 0, missing: '—' })).toBe('0%');
  });
});
