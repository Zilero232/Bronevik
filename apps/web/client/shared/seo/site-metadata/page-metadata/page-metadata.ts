import type { Metadata } from 'next';

import { isNonNullish } from 'remeda';

import { SITE } from '@/shared/config';
import { localePath } from '@/shared/i18n';

import type { PageMetadataInput } from './page-metadata.types';

import { languageAlternates, siteImage } from '../site-metadata';

const OG_LOCALES: Record<string, string> = {
  ru: SITE.locale,
  en: SITE.en.locale
};

export const createPageMetadata = ({
  title,
  description,
  path,
  locale,
  index = false,
  follow = false,
  hasOwnImage = false
}: PageMetadataInput): Metadata => {
  const ogTitle = title.includes(SITE.name) ? title : `${title} · ${SITE.name}`;
  const canonical = isNonNullish(path) ? localePath({ path, locale }) : undefined;

  return {
    title: { absolute: ogTitle },
    description,
    ...(index && isNonNullish(path) ? { alternates: { canonical, languages: languageAlternates(path) } } : {}),
    robots: { index, follow },
    openGraph: {
      title: ogTitle,
      description,
      ...(isNonNullish(canonical) ? { url: canonical } : {}),
      type: 'website',
      siteName: SITE.name,
      locale: OG_LOCALES[locale],
      ...(hasOwnImage ? {} : { images: [siteImage(locale)] })
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description
    }
  };
};
