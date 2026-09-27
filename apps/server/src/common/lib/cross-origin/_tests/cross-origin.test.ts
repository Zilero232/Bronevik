import { describe, expect, it } from 'vitest';

import { isCrossOriginStateChange } from '../cross-origin';
import { CROSS_ORIGIN } from '../cross-origin.constants';

const SITE = 'https://triotmetki.ru';
const SESSION = `__Secure-${CROSS_ORIGIN.sessionCookie}=abc.def`;
const BASE = { method: 'POST', origin: SITE, fetchSite: 'same-site', cookie: SESSION, allowed: [SITE] };

describe('isCrossOriginStateChange', () => {
  it('lets the site change state with its session cookie', () => {
    expect(isCrossOriginStateChange(BASE)).toBe(false);
  });

  it('refuses a cookie-carrying write from an origin outside the allowlist', () => {
    expect(isCrossOriginStateChange({ ...BASE, origin: 'https://evil.triotmetki.ru' })).toBe(true);
  });

  it('refuses a cookie-carrying write the browser marks cross-site when it sends no origin', () => {
    expect(isCrossOriginStateChange({ ...BASE, origin: undefined, fetchSite: 'cross-site' })).toBe(true);
  });

  it('allows a write without origin from a client that is not a browser', () => {
    expect(isCrossOriginStateChange({ ...BASE, origin: undefined, fetchSite: undefined })).toBe(false);
  });

  it.each(CROSS_ORIGIN.safeMethods)('never blocks a %s request', (method) => {
    expect(isCrossOriginStateChange({ ...BASE, method, origin: 'https://evil.example' })).toBe(false);
  });

  it('ignores requests that carry no session cookie, such as bearer and signed calls', () => {
    expect(isCrossOriginStateChange({ ...BASE, origin: 'https://evil.example', cookie: 'theme=dark' })).toBe(false);
  });
});
