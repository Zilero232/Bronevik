import { describe, expect, it } from 'vitest';

import { SITE } from '@/shared/config';

import { sitemapEntries } from '../sitemap';

describe('sitemapEntries', () => {
  it('builds absolute URLs with locale alternates and drops duplicates', () => {
    const entries = sitemapEntries(['/tanks', '/tanks']);

    expect(entries).toEqual([
      {
        url: new URL('/tanks', SITE.url).toString(),
        alternates: { languages: { ru: new URL('/tanks', SITE.url).toString(), en: new URL('/en/tanks', SITE.url).toString() } }
      }
    ]);
  });
});
