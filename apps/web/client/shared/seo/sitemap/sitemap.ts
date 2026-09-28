import type { MetadataRoute } from 'next';

import { mapValues } from 'remeda';

import type { LocalePathInput } from '@/shared/i18n';

import { localePath, LOCALES } from '@/shared/i18n';

import { absoluteUrl, contentAlternates, languageAlternates } from '../site-metadata';

export const sitemapEntries = (paths: readonly string[]): MetadataRoute.Sitemap =>
  [...new Set(paths)].flatMap((path) => {
    const languages = mapValues(languageAlternates(path), absoluteUrl);

    return LOCALES.map((locale) => ({ url: absoluteUrl(localePath({ path, locale })), alternates: { languages } }));
  });

export const sitemapContentEntries = (items: readonly LocalePathInput[]): MetadataRoute.Sitemap =>
  items.map((item) => ({ url: absoluteUrl(localePath(item)), alternates: { languages: mapValues(contentAlternates(item), absoluteUrl) } }));
