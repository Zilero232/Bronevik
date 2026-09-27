import { describe, expect, it } from 'vitest';

import { resolveLocale } from '../locale';
import { DEFAULT_LOCALE, LOCALES } from '../locale.constants';

describe('resolveLocale', () => {
  it('keeps every locale the router serves', () => {
    LOCALES.forEach((locale) => expect(resolveLocale(locale)).toBe(locale));
  });

  it('falls back to the default locale for anything else', () => {
    [undefined, '', 'de', 'RU'].forEach((value) => expect(resolveLocale(value)).toBe(DEFAULT_LOCALE));
  });
});
