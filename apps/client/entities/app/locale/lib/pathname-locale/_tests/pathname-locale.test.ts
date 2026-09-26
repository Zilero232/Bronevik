import { describe, expect, it } from 'vitest';

import { DEFAULT_LOCALE } from '@/shared/i18n';

import { pathnameLocale } from '../pathname-locale';

describe('pathnameLocale', () => {
  it('reads the locale prefix', () => {
    expect(pathnameLocale('/en')).toBe('en');
    expect(pathnameLocale('/en/tanks/is-7')).toBe('en');
  });

  it('falls back to the default locale without a prefix', () => {
    expect(pathnameLocale('/')).toBe(DEFAULT_LOCALE);
    expect(pathnameLocale('')).toBe(DEFAULT_LOCALE);
    expect(pathnameLocale('/tanks')).toBe(DEFAULT_LOCALE);
  });

  it('does not match a segment that only starts with a locale', () => {
    expect(pathnameLocale('/english')).toBe(DEFAULT_LOCALE);
  });
});
