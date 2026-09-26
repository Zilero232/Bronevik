import { describe, expect, it } from 'vitest';

import { allowedOrigins, corsOptionsFor, isPublicCorsPath } from '../cors';

const origins = ['https://triotmetki.ru'];

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

describe('allowedOrigins', () => {
  it('reduces the site URL to its origin and puts it first', () => {
    expect(allowedOrigins({ WEB_URL: 'https://triotmetki.ru/ru/path?x=1', CORS_ORIGINS: 'https://admin.triotmetki.ru' })).toEqual([
      'https://triotmetki.ru',
      'https://admin.triotmetki.ru'
    ]);
  });

  it('trims extra origins, drops blanks and duplicates', () => {
    expect(allowedOrigins({ WEB_URL: 'https://triotmetki.ru', CORS_ORIGINS: ' https://a.test , ,https://triotmetki.ru,https://a.test ' })).toEqual([
      'https://triotmetki.ru',
      'https://a.test'
    ]);
  });

  it('allows nothing extra for an empty list', () => {
    expect(allowedOrigins({ WEB_URL: 'https://triotmetki.ru', CORS_ORIGINS: '' })).toEqual(['https://triotmetki.ru']);
  });

  it('skips a site URL that is not a URL instead of allowing it verbatim', () => {
    expect(allowedOrigins({ WEB_URL: 'not a url', CORS_ORIGINS: 'https://a.test' })).toEqual(['https://a.test']);
  });
});
