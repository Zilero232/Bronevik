import { describe, expect, it } from 'vitest';

import { statValueText } from '..';

const text = (value: Parameters<typeof statValueText>[0]['value'], kind?: Parameters<typeof statValueText>[0]['kind']) =>
  statValueText({ value, kind, locale: 'en' });

describe('statValueText', () => {
  it('rounds counts to whole numbers with grouping', () => {
    expect(text(2750.4)).toBe('2,750');
  });

  it('keeps two decimals for averages', () => {
    expect(text(1.2, 'decimal')).toBe('1.20');
  });

  it('reads percent values on the 0–100 scale', () => {
    expect(text(49.84, 'percent')).toBe('49.84%');
  });

  it('shows a dash for missing or non-finite values', () => {
    expect([text(null), text(undefined), text(Number.NaN)]).toEqual(['—', '—', '—']);
  });

  it('passes preformatted text through', () => {
    expect(text('1.45')).toBe('1.45');
  });
});
