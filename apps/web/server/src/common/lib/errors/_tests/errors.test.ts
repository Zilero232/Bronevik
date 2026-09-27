import { describe, expect, it } from 'vitest';

import { errorMessage } from '../errors';

describe('errorMessage', () => {
  it('reads the message of an Error', () => {
    expect(errorMessage(new TypeError('broken'))).toBe('broken');
  });

  it('stringifies anything that is not an Error', () => {
    expect(errorMessage('plain')).toBe('plain');
    expect(errorMessage(42)).toBe('42');
    expect(errorMessage(null)).toBe('null');
  });
});
