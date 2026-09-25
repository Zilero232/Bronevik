import { describe, expect, it } from 'vitest';

import { bonusCodeReportSchema, bonusCodeValueSchema } from '../shop.schemas';

describe('shop schemas', () => {
  it('normalises bonus codes to trimmed upper case', () => {
    expect(bonusCodeValueSchema.parse('  tanks-2026 ')).toBe('TANKS-2026');
  });

  it('rejects codes with spaces or outside the length bounds', () => {
    expect(bonusCodeValueSchema.safeParse('ab c').success).toBe(false);
    expect(bonusCodeValueSchema.safeParse('abc').success).toBe(false);
    expect(bonusCodeValueSchema.safeParse('a'.repeat(33)).success).toBe(false);
  });

  it('accepts a report only with a known verdict', () => {
    expect(bonusCodeReportSchema.safeParse({ code: 'WORKING1', verdict: 'working' }).success).toBe(true);
    expect(bonusCodeReportSchema.safeParse({ code: 'WORKING1', verdict: 'maybe' }).success).toBe(false);
  });
});
