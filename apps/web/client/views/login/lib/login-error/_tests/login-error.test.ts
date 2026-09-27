import { describe, expect, it } from 'vitest';

import { LOGIN } from '../../../config/login.constants';
import { loginErrorKey } from '../login-error';

describe('loginErrorKey', () => {
  it('keeps every error code the server can send', () => {
    LOGIN.errors.forEach((code) => {
      expect(loginErrorKey(code)).toBe(code);
    });
  });

  it('falls back to the generic message for an unknown code', () => {
    expect(loginErrorKey('something_else')).toBe('unknown');
  });

  it('treats an empty code as unknown', () => {
    expect(loginErrorKey('')).toBe('unknown');
  });
});
