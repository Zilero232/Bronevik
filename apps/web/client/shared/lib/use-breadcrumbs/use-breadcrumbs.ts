import { useLocale } from 'next-intl';

import { resolveLocale } from '@/shared/i18n';
import { breadcrumbJsonLd } from '@/shared/seo/json-ld';

import type { BreadcrumbTrailItem } from '../breadcrumb-trail';

import { breadcrumbCrumbs, breadcrumbTrail } from '../breadcrumb-trail';

export const useBreadcrumbs = (items: readonly BreadcrumbTrailItem[]) => {
  const locale = resolveLocale(useLocale());
  const trail = breadcrumbTrail(items);

  return {
    crumbs: breadcrumbCrumbs(items),
    jsonLd: trail ? breadcrumbJsonLd({ items: trail, locale }) : null
  };
};
