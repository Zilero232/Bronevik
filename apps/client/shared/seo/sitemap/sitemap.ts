import type { MetadataRoute } from 'next';

import { DEFAULT_LOCALE, localePath, LOCALES } from '@/shared/i18n';

import { absoluteUrl } from '../site-metadata';

export const sitemapEntries = (paths: readonly string[]): MetadataRoute.Sitemap =>
  [...new Set(paths)].map((path) => ({
    url: absoluteUrl(localePath({ path, locale: DEFAULT_LOCALE })),
    alternates: { languages: Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(localePath({ path, locale }))])) }
  }));
