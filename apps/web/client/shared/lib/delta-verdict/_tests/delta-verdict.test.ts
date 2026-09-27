import { describe, expect, it } from 'vitest';

import { deltaVerdict } from '../delta-verdict';

describe('deltaVerdict', () => {
  it('treats growth as better by default', () => {
    expect(deltaVerdict({ value: 1.5 })).toBe('better');
    expect(deltaVerdict({ value: -0.2 })).toBe('worse');
  });

  it('flips the verdict when lower is better', () => {
    expect(deltaVerdict({ value: -120, isLowerBetter: true })).toBe('better');
    expect(deltaVerdict({ value: 120, isLowerBetter: true })).toBe('worse');
  });

  it('calls no change the same', () => {
    expect(deltaVerdict({ value: 0 })).toBe('same');
  });

  it('judges the value as displayed, so a delta that rounds to zero is the same', () => {
    expect(deltaVerdict({ value: 0.001, digits: 2 })).toBe('same');
    expect(deltaVerdict({ value: -0.004, digits: 2 })).toBe('same');
    expect(deltaVerdict({ value: 0.006, digits: 2 })).toBe('better');
  });

  it('never colours a missing or infinite value', () => {
    expect(deltaVerdict({ value: Number.NaN })).toBe('same');
    expect(deltaVerdict({ value: Number.POSITIVE_INFINITY })).toBe('same');
  });
});
