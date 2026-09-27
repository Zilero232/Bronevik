import type { JsonLdCrumb } from '@/shared/seo/json-ld';

import type { BreadcrumbTrailItem } from './breadcrumb-trail.types';

export const breadcrumbTrail = (items: readonly BreadcrumbTrailItem[]): JsonLdCrumb[] | null => {
  if (items.length < 2 || !items.every(({ label }) => typeof label === 'string')) {
    return null;
  }

  return items.flatMap(({ label, href }, index) => (href || index === items.length - 1 ? [{ name: String(label), path: href }] : []));
};
