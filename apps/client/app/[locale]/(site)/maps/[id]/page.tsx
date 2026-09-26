import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { mapRouteName, mapSlugs } from '@/entities/map/map';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
import { MapPage } from '@/views/map';

export const generateStaticParams = async () => (await mapSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.map })).map((id) => ({ id }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/maps/[id]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { id } = await params;
  const t = await getTranslations({ locale, namespace: 'maps.mapMeta' });
  const name = await mapRouteName(id);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.maps.detail(id),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <>
    <Suspense>
      <MapPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
