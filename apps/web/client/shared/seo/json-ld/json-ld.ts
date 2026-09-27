import { isNonNullish } from 'remeda';

import type { Locale, LocalePathInput } from '@/shared/i18n';

import { SITE } from '@/shared/config/site';
import { ROUTES } from '@/shared/constants';
import { localePath } from '@/shared/i18n';

import type { BreadcrumbJsonLdInput, EntityJsonLdInput } from './json-ld.types';

import { absoluteUrl } from '../site-metadata';
import { JSON_LD } from './json-ld.constants';

const localeUrl = (input: LocalePathInput) => absoluteUrl(localePath(input));

export const jsonLdText = (data: object) => JSON.stringify(data).replaceAll('<', JSON_LD.escapedLt);

export const organizationJsonLd = () => ({
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: absoluteUrl(JSON_LD.logo)
});

export const siteJsonLd = (locale: Locale) => ({
  '@context': JSON_LD.context,
  '@graph': [
    organizationJsonLd(),
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      name: SITE.name,
      url: localeUrl({ path: ROUTES.home, locale }),
      inLanguage: locale,
      publisher: { '@id': `${SITE.url}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE.url}${localePath({ path: ROUTES.players.profile(''), locale })}{${JSON_LD.searchTerm}}`
        },
        'query-input': `required name=${JSON_LD.searchTerm}`
      }
    }
  ]
});

export const breadcrumbJsonLd = ({ items, locale }: BreadcrumbJsonLdInput) => ({
  '@context': JSON_LD.context,
  '@type': 'BreadcrumbList',
  itemListElement: items.map(({ name, path }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    ...(isNonNullish(path) ? { item: localeUrl({ path, locale }) } : {})
  }))
});

export const personJsonLd = ({ name, path, locale, image }: EntityJsonLdInput) => ({
  '@context': JSON_LD.context,
  '@type': 'ProfilePage',
  url: localeUrl({ path, locale }),
  mainEntity: { '@type': 'Person', name, url: localeUrl({ path, locale }), ...(image ? { image } : {}) }
});

export const clanJsonLd = ({ name, path, locale, image }: EntityJsonLdInput) => ({
  '@context': JSON_LD.context,
  '@type': 'SportsTeam',
  name,
  url: localeUrl({ path, locale }),
  ...(image ? { logo: image } : {})
});
