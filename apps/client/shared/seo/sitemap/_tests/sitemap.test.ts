import { describe, expect, it } from 'vitest';

import { SITE } from '@/shared/config';

import { sitemapEntries } from '../sitemap';

describe('sitemapEntries', () => {
  it('builds absolute URLs with locale and x-default alternates and drops duplicates', () => {
    const entries = sitemapEntries(['/tanks', '/tanks']);

    expect(entries).toEqual([
      {
        url: new URL('/tanks', SITE.url).toString(),
        alternates: {
          languages: {
            ru: new URL('/tanks', SITE.url).toString(),
            en: new URL('/en/tanks', SITE.url).toString(),
            'x-default': new URL('/tanks', SITE.url).toString()
          }
        }
      }
    ]);
  });
});
