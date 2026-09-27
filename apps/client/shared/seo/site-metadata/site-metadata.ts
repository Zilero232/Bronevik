import type { Locale } from '@/shared/i18n';

import { SITE } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { DEFAULT_LOCALE, localePath, LOCALES } from '@/shared/i18n';

import { OG_SIZE } from '../og/og.constants';
import { X_DEFAULT } from './site-metadata.constants';

export const absoluteUrl = (path: string): string => new URL(path, SITE.url).toString();

export const languageAlternates = (path: string): Record<string, string> => {
  const localized = LOCALES.map((locale) => [locale, localePath({ path, locale })]);

  return Object.fromEntries([...localized, [X_DEFAULT, localePath({ path, locale: DEFAULT_LOCALE })]]);
};

export const siteImage = (locale: Locale) => ({ url: ROUTES.api.siteCard(locale), ...OG_SIZE, alt: SITE.name });
