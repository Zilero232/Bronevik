import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { tankRouteName, topTankSlugs } from '@/entities/tank/tank/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
import { BuildPage } from '@/views/build';

export const generateStaticParams = async () => (await topTankSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.tank })).map((tank) => ({ tank }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/builds/[tank]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { tank } = await params;
  const t = await getTranslations({ locale, namespace: 'builds.meta' });
  const name = await tankRouteName(tank);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.builds.detail(tank),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <>
    <Suspense>
      <BuildPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
