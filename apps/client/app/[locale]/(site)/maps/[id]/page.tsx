import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { mapRouteEntity, mapSlugs } from '@/entities/map/map/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
import { RouteGuard } from '@/shared/seo/route-guard';
import { MapPage } from '@/views/map';

export const generateStaticParams = async () => (await mapSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.map })).map((id) => ({ id }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/maps/[id]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { id } = await params;
  const t = await getTranslations({ locale, namespace: 'maps.mapMeta' });
  const { name, isFound } = await mapRouteEntity(id);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.maps.detail(id),
    locale,
    index: isFound,
    follow: isFound
  });
};

const Page = ({ params }: PageProps<'/[locale]/maps/[id]'>) => (
  <>
    <Suspense>
      <RouteGuard entity={params.then(({ id }) => mapRouteEntity(id))} />
    </Suspense>
    <Suspense>
      <MapPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
