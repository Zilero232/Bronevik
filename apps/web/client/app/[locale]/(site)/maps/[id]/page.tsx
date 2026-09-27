import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { mapRouteEntity, mapSlugs } from '@/entities/map/map/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { PrefetchBoundary } from '@/shared/seo/prefetch-boundary';
import { RequestTime } from '@/shared/seo/request-time';
import { requireRouteEntity } from '@/shared/seo/require-route-entity';
import { MapPage } from '@/views/map';
import { mapPageState } from '@/views/map/server';

export const generateStaticParams = async () => (await mapSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.map })).map((id) => ({ id }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/maps/[id]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const id = decodeRouteParam((await params).id);
  const t = await getTranslations({ locale, namespace: 'maps.mapMeta' });
  const { name } = await requireRouteEntity(mapRouteEntity(id));

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.maps.detail(id),
    locale,
    index: true,
    follow: true
  });
};

const Page = async ({ params }: PageProps<'/[locale]/maps/[id]'>) => {
  const id = decodeRouteParam((await params).id);

  await requireRouteEntity(mapRouteEntity(id));

  return (
    <>
      <Suspense>
        <PrefetchBoundary state={mapPageState(id)}>
          <MapPage />
        </PrefetchBoundary>
      </Suspense>
      <Suspense>
        <RequestTime />
      </Suspense>
    </>
  );
};

export default Page;
