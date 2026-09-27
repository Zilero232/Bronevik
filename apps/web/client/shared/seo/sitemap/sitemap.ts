import type { MetadataRoute } from 'next';

import { mapValues } from 'remeda';

import { DEFAULT_LOCALE, localePath } from '@/shared/i18n';

import { absoluteUrl, languageAlternates } from '../site-metadata';

export const sitemapEntries = (paths: readonly string[]): MetadataRoute.Sitemap =>
  [...new Set(paths)].map((path) => ({
    url: absoluteUrl(localePath({ path, locale: DEFAULT_LOCALE })),
    alternates: { languages: mapValues(languageAlternates(path), absoluteUrl) }
  }));
