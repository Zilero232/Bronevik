import { describe, expect, it } from 'vitest';

import { SITE } from '@/shared/config';

import { sitemapEntries } from '../sitemap';

describe('sitemapEntries', () => {
  it('lists every locale version with locale and x-default alternates and drops duplicates', () => {
    const languages = {
      ru: new URL('/tanks', SITE.url).toString(),
      en: new URL('/en/tanks', SITE.url).toString(),
      'x-default': new URL('/tanks', SITE.url).toString()
    };

    expect(sitemapEntries(['/tanks', '/tanks'])).toEqual([
      { url: languages.ru, alternates: { languages } },
      { url: languages.en, alternates: { languages } }
    ]);
  });
});
