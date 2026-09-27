import { describe, expect, it } from 'vitest';

import { localeHref } from '../locale-href';

describe('localeHref', () => {
  it('returns the pathname alone when there is no query or hash', () => {
    expect(localeHref({ pathname: '/tanks' })).toBe('/tanks');
    expect(localeHref({ pathname: '/tanks', search: '', hash: '' })).toBe('/tanks');
  });

  it('keeps the query string', () => {
    expect(localeHref({ pathname: '/tanks', search: '?tier=10&nation=ussr' })).toBe('/tanks?tier=10&nation=ussr');
  });

  it('keeps the hash', () => {
    expect(localeHref({ pathname: '/marks', hash: '#closest' })).toBe('/marks#closest');
  });

  it('keeps both in order', () => {
    expect(localeHref({ pathname: '/tanks', search: '?tier=10', hash: '#table' })).toBe('/tanks?tier=10#table');
  });

  it('adds missing prefixes', () => {
    expect(localeHref({ pathname: '/tanks', search: 'tier=10', hash: 'table' })).toBe('/tanks?tier=10#table');
  });

  it('drops a bare separator', () => {
    expect(localeHref({ pathname: '/', search: '?', hash: '#' })).toBe('/');
  });
});
