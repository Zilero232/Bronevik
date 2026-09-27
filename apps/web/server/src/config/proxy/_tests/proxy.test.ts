import { describe, expect, it } from 'vitest';

import { expressTrustProxy, trustedProxies } from '../proxy';
import { PROXY } from '../proxy.constants';

describe('trustedProxies', () => {
  it('reads a comma-separated list of addresses and ranges, ignoring blanks', () => {
    expect(trustedProxies({ TRUSTED_PROXIES: ' 10.0.0.0/8, ,173.245.48.0/20 ' })).toEqual(['10.0.0.0/8', '173.245.48.0/20']);
  });

  it('is empty when nothing is configured', () => {
    expect(trustedProxies({ TRUSTED_PROXIES: '' })).toEqual([]);
  });
});

describe('expressTrustProxy', () => {
  it('trusts exactly the configured proxy chain', () => {
    expect(expressTrustProxy({ TRUSTED_PROXIES: '10.0.0.0/8' })).toEqual(['10.0.0.0/8']);
  });

  it('falls back to the single reverse proxy in front of the API', () => {
    expect(expressTrustProxy({ TRUSTED_PROXIES: '' })).toBe(PROXY.defaultHops);
  });
});
