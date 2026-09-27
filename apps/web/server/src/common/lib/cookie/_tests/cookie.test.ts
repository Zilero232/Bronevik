import { describe, expect, it } from 'vitest';

import { readCookie } from '../cookie';

describe('readCookie', () => {
  it('returns the decoded value of the named cookie', () => {
    expect(readCookie({ header: 'a=1; target=x%2By; b=2', name: 'target' })).toBe('x+y');
  });

  it('does not match a cookie whose name only ends with the requested one', () => {
    expect(readCookie({ header: 'not_target=1', name: 'target' })).toBeNull();
  });

  it('returns null without a cookie header', () => {
    expect(readCookie({ header: undefined, name: 'target' })).toBeNull();
  });

  it('returns null for a value that is not valid percent-encoding', () => {
    expect(readCookie({ header: 'target=%E0%A4%A', name: 'target' })).toBeNull();
  });

  it('keeps an empty value distinct from a missing cookie', () => {
    expect(readCookie({ header: 'target=', name: 'target' })).toBe('');
  });
});
