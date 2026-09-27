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
import { TankArmorPage } from '@/views/tank-armor';

export const generateStaticParams = async () => (await topTankSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.tankArmor })).map((slug) => ({ slug }));

export const generateMetadata = async ({ params }: Pick<PageProps<'/[locale]/t/[slug]/armor'>, 'params'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { slug } = await params;
  const t = await getTranslations({ locale, namespace: 'armor.meta' });
  const { name, isFound } = await tankRouteEntity(slug);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.tanks.armor(slug),
    locale,
    index: isFound,
    follow: isFound
  });
};

const Page = ({ params }: PageProps<'/[locale]/t/[slug]/armor'>) => (
  <>
    <Suspense>
      <RouteGuard entity={params.then(({ slug }) => tankRouteEntity(slug))} />
    </Suspense>
    <Suspense>
      <TankArmorPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
