import { describe, expect, it } from 'vitest';

import { formatNumber, formatPercent, formatReload, formatSeconds, formatSigned } from '../hud-format';

describe('HUD number formatting', () => {
  it('groups thousands with a thin no-break space and abbreviates only from 100 000', () => {
    expect(formatNumber(6812)).toBe('6 812');
    expect(formatNumber(99_999)).toBe('99 999');
    expect(formatNumber(128_400)).toBe('128 k');
    expect(formatNumber(-1200)).toBe('-1 200');
    expect(formatNumber(0)).toBe('0');
  });

  it('always signs a delta', () => {
    expect(formatSigned(238)).toBe('+238');
    expect(formatSigned(-1200)).toBe('-1 200');
    expect(formatSigned(0)).toBe('0');
  });

  it('writes percent with a decimal comma', () => {
    expect(formatPercent({ value: 87.344, digits: 2 })).toBe('87,34 %');
    expect(formatPercent({ value: 0.42, digits: 2, signed: true })).toBe('+0,42 %');
    expect(formatPercent({ value: -0.5, digits: 2, signed: true })).toBe('-0,50 %');
  });

  it('writes seconds and reloads the way the client does', () => {
    expect(formatSeconds(12.2)).toBe('13');
    expect(formatSeconds(65)).toBe('1:05');
    expect(formatReload(3.24)).toBe('3.2');
  });
});
