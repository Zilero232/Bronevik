import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE, LOCALES } from '../../locale';
import { localePath } from '../locale-path';

const OTHER_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

describe('localePath', () => {
  it('leaves the default locale unprefixed', () => {
    expect(localePath({ path: '/tanks', locale: DEFAULT_LOCALE })).toBe('/tanks');
    expect(localePath({ path: '/', locale: DEFAULT_LOCALE })).toBe('/');
  });

  it('prefixes every other locale', () => {
    OTHER_LOCALES.forEach((locale) => {
      expect(localePath({ path: '/tanks', locale })).toBe(`/${locale}/tanks`);
    });
  });

  it('maps the home page of another locale to the bare prefix, without a trailing slash', () => {
    OTHER_LOCALES.forEach((locale) => {
      expect(localePath({ path: '/', locale })).toBe(`/${locale}`);
    });
  });
});
