import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { tankRouteEntity, topTankSlugs } from '@/entities/tank/tank/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
import { requireRouteEntity } from '@/shared/seo/require-route-entity';
import { TankArmorPage } from '@/views/tank-armor';

export const generateStaticParams = async () => (await topTankSlugs({ fallback: ROUTE_STATIC_PARAMS.fallback.tankArmor })).map((slug) => ({ slug }));

export const generateMetadata = async ({ params }: Pick<PageProps<'/[locale]/t/[slug]/armor'>, 'params'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const slug = decodeRouteParam((await params).slug);
  const t = await getTranslations({ locale, namespace: 'armor.meta' });
  const { name } = await requireRouteEntity(tankRouteEntity(slug));

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.tanks.armor(slug),
    locale,
    index: true,
    follow: true
  });
};

const Page = async ({ params }: PageProps<'/[locale]/t/[slug]/armor'>) => {
  await requireRouteEntity(tankRouteEntity(decodeRouteParam((await params).slug)));

  return (
    <>
      <Suspense>
        <TankArmorPage />
      </Suspense>
      <Suspense>
        <RequestTime />
      </Suspense>
    </>
  );
};

export default Page;
