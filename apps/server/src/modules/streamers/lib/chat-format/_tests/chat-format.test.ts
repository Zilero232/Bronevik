import { describe, expect, it } from 'vitest';

import { chatNumber } from '../chat-format';

describe('chatNumber', () => {
  it('rounds to the requested digits', () => {
    expect(chatNumber({ value: 52.345, digits: 1, missing: '—' })).toBe('52.3');
    expect(chatNumber({ value: 1999.6, missing: '—' })).toBe('2000');
  });

  it('shows the placeholder for a missing or broken value but keeps a real zero', () => {
    expect(chatNumber({ value: null, missing: '—' })).toBe('—');
    expect(chatNumber({ value: Number.NaN, missing: '—' })).toBe('—');
    expect(chatNumber({ value: 0, missing: '—' })).toBe('0');
  });
});
