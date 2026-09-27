import { describe, expect, it } from 'vitest';

import { normalizePromoCode } from '../promo-code';

describe('normalizePromoCode', () => {
  it('trims the code', () => {
    expect(normalizePromoCode('  SPRING  ')).toBe('SPRING');
  });

  it('drops a blank code', () => {
    expect(normalizePromoCode('   ')).toBeUndefined();
  });
});
