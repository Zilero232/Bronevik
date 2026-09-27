import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { tankRouteEntity, topTankSlugs } from '@/entities/tank/tank/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { PrefetchBoundary } from '@/shared/seo/prefetch-boundary';
import { RequestTime } from '@/shared/seo/request-time';
import { RouteGuard } from '@/shared/seo/route-guard';
import { TankPage } from '@/views/tank';
import { tankPageState } from '@/views/tank/server';

export const generateStaticParams = async () => (await topTankSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.tank })).map((slug) => ({ slug }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/t/[slug]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { slug } = await params;
  const t = await getTranslations({ locale, namespace: 'tank.meta' });
  const { name, isFound } = await tankRouteEntity(slug);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.tanks.detail(slug),
    locale,
    index: isFound,
    follow: isFound,
    hasOwnImage: true
  });
};

const Page = ({ params }: PageProps<'/[locale]/t/[slug]'>) => (
  <>
    <Suspense>
      <RouteGuard entity={params.then(({ slug }) => tankRouteEntity(slug))} />
    </Suspense>
    <Suspense>
      <PrefetchBoundary state={params.then(({ slug }) => tankPageState(slug))}>
        <TankPage />
      </PrefetchBoundary>
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
