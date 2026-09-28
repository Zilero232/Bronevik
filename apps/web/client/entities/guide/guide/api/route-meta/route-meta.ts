import { isIncludedIn } from 'remeda';

import type { RouteStaticParamsInput } from '@/shared/seo';

import { LOCALES } from '@/shared/i18n';
import { ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { lookupRouteMeta } from '@/shared/seo/server';

import type { GuideRouteMeta, GuideSitemapItem } from './route-meta.types';

import { getGuide, listGuides } from '../guides';

export const guideRouteMeta = async (slug: string): Promise<GuideRouteMeta | null> => {
  'use cache';

  return lookupRouteMeta(async () => {
    const { title, status, locale } = await getGuide({ slug });

    return { title, isPublished: status === 'published', contentLocale: isIncludedIn(locale, LOCALES) ? locale : null };
  });
};

export const guideSitemapItems = async ({ limit = ROUTE_STATIC_PARAMS.limit }: RouteStaticParamsInput): Promise<GuideSitemapItem[]> => {
  'use cache';

  try {
    const { items } = await listGuides({ limit, sort: 'popular' });

    return items.flatMap(({ slug, locale, status }) => (status === 'published' && isIncludedIn(locale, LOCALES) ? [{ slug, locale }] : []));
  } catch {
    return [];
  }
};
