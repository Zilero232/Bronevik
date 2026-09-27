import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { tankRouteEntity, topTankSlugs } from '@/entities/tank/tank/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
import { RouteGuard } from '@/shared/seo/route-guard';
import { BuildPage } from '@/views/build';

export const generateStaticParams = async () => (await topTankSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.tank })).map((tank) => ({ tank }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/builds/[tank]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { tank } = await params;
  const t = await getTranslations({ locale, namespace: 'builds.meta' });
  const { name, isFound } = await tankRouteEntity(tank);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.builds.detail(tank),
    locale,
    index: isFound,
    follow: isFound
  });
};

const Page = ({ params }: PageProps<'/[locale]/builds/[tank]'>) => (
  <>
    <Suspense>
      <RouteGuard entity={params.then(({ tank }) => tankRouteEntity(tank))} />
    </Suspense>
    <Suspense>
      <BuildPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
