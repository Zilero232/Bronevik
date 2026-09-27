import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { tankRouteEntity, topTankSlugs } from '@/entities/tank/tank/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { PrefetchBoundary } from '@/shared/seo/prefetch-boundary';
import { RequestTime } from '@/shared/seo/request-time';
import { requireRouteEntity } from '@/shared/seo/require-route-entity';
import { BuildPage } from '@/views/build';
import { buildPageState } from '@/views/build/server';

export const generateStaticParams = async () => (await topTankSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.tank })).map((tank) => ({ tank }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/builds/[tank]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const tank = decodeRouteParam((await params).tank);
  const t = await getTranslations({ locale, namespace: 'builds.meta' });
  const { name } = await requireRouteEntity(tankRouteEntity(tank));

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.builds.detail(tank),
    locale,
    index: true,
    follow: true,
    hasOwnImage: true
  });
};

const Page = async ({ params }: PageProps<'/[locale]/builds/[tank]'>) => {
  const tank = decodeRouteParam((await params).tank);

  await requireRouteEntity(tankRouteEntity(tank));

  return (
    <>
      <Suspense>
        <PrefetchBoundary state={buildPageState(tank)}>
          <BuildPage />
        </PrefetchBoundary>
      </Suspense>
      <Suspense>
        <RequestTime />
      </Suspense>
    </>
  );
};

export default Page;
