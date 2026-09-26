import { describe, expect, it } from 'vitest';

import { SITE } from '@/shared/config';
import { DEFAULT_LOCALE, localePath, LOCALES } from '@/shared/i18n';

import { createPageMetadata } from '../page-metadata';
import { X_DEFAULT } from '../site-metadata.constants';
import { absoluteUrl, languageAlternates } from '../site-metadata';

describe('languageAlternates', () => {
  it('lists every locale plus x-default pointing at the default locale', () => {
    const alternates = languageAlternates('/tanks');

    expect(Object.keys(alternates).sort()).toEqual([...LOCALES, X_DEFAULT].sort());
    expect(alternates[X_DEFAULT]).toBe(alternates[DEFAULT_LOCALE]);
  });

  it('localises the path for every locale', () => {
    const alternates = languageAlternates('/tanks');

    LOCALES.forEach((locale) => expect(alternates[locale]).toBe(localePath({ path: '/tanks', locale })));
  });
});

describe('absoluteUrl', () => {
  it('resolves a path against the site origin', () => {
    expect(absoluteUrl('/tanks')).toBe(new URL('/tanks', SITE.url).toString());
  });
});

describe('createPageMetadata', () => {
  it('appends the site name to the title once', () => {
    const plain = createPageMetadata({ title: 'Танки', description: '', locale: DEFAULT_LOCALE });
    const branded = createPageMetadata({ title: `${SITE.name} — главная`, description: '', locale: DEFAULT_LOCALE });

    expect(plain.title).toEqual({ absolute: `Танки · ${SITE.name}` });
    expect(branded.title).toEqual({ absolute: `${SITE.name} — главная` });
  });

  it('keeps pages out of the index unless asked', () => {
    const hidden = createPageMetadata({ title: 'x', description: '', path: '/x', locale: DEFAULT_LOCALE });
    const indexed = createPageMetadata({ title: 'x', description: '', path: '/x', locale: DEFAULT_LOCALE, index: true });

    expect(hidden.robots).toEqual({ index: false, follow: false });
    expect(hidden.alternates).toBeUndefined();
    expect(indexed.alternates?.languages).toEqual(languageAlternates('/x'));
  });
});
