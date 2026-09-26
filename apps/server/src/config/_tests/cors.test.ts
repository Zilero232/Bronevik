import { describe, expect, it } from 'vitest';

import { corsOptionsFor, isPublicCorsPath } from '../cors';

const origins = ['https://bronevik.app'];

describe('isPublicCorsPath', () => {
  it.each(['/v1', '/v1/players/1', '/v1/tanks?tier=10', '/overlays/0123abcd', '/overlays/0123abcd/stream'])('opens %s to any origin', (url) => {
    expect(isPublicCorsPath(url)).toBe(true);
  });

  it.each(['/v10/players', '/me/developer', '/overlays', '/overlays/a/b/c', '/streamers/me/overlays/preview'])(
    'keeps %s behind the site origins',
    (url) => {
      expect(isPublicCorsPath(url)).toBe(false);
    }
  );
});

describe('corsOptionsFor', () => {
  it('never sends credentials to an arbitrary origin', () => {
    expect(corsOptionsFor({ url: '/v1/players/1', origins })).toMatchObject({ origin: '*', credentials: false });
  });

  it('keeps credentials for the site API and only for the listed origins', () => {
    expect(corsOptionsFor({ url: '/me/billing', origins })).toMatchObject({ origin: origins, credentials: true });
  });
});
