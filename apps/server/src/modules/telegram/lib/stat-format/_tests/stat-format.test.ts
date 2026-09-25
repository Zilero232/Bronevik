import { describe, expect, it } from 'vitest';

import { formatNumber, formatPercent } from '../stat-format';

describe('stat formatting', () => {
  it('returns null for a missing value so the caller shows a dash', () => {
    expect(formatNumber({ value: null, locale: 'ru' })).toBeNull();
    expect(formatPercent({ value: Number.NaN, locale: 'ru' })).toBeNull();
  });

  it('formats a ratio as a percent', () => {
    expect(formatPercent({ value: 0.5234, locale: 'en' })).toBe('52.34%');
  });
});
