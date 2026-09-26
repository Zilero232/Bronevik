import { describe, expect, it } from 'vitest';

import { deltaVerdict } from '../delta-verdict';

describe('deltaVerdict', () => {
  it('treats a missing or zero change as neutral', () => {
    expect(deltaVerdict({ value: null })).toBe('same');
    expect(deltaVerdict({ value: 0 })).toBe('same');
  });

  it('calls a rise better when higher is better', () => {
    expect(deltaVerdict({ value: 1.2 })).toBe('better');
    expect(deltaVerdict({ value: -0.4 })).toBe('worse');
  });

  it('flips the verdict when lower is better', () => {
    expect(deltaVerdict({ value: -120, isLowerBetter: true })).toBe('better');
    expect(deltaVerdict({ value: 80, isLowerBetter: true })).toBe('worse');
  });
});
