import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { getTank, listTankStats } from '@/shared/api/tanks';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { BuildPage } from '@/views/build';

const nameOf = async (value: string) => {
  'use cache';

  try {
    return (await getTank({ idOrSlug: value })).vehicle.name;
  } catch {
    return decodeURIComponent(value);
  }
};

const STATIC_PARAMS = { limit: 20, fallback: [{ tank: 'object-140' }] } as const;

export const generateStaticParams = async () => {
  'use cache';

  try {
    const params = (await listTankStats({ limit: STATIC_PARAMS.limit })).items.map(({ vehicle }) => ({ tank: vehicle.slug }));

    return params.length > 0 ? params : [...STATIC_PARAMS.fallback];
  } catch {
    return [...STATIC_PARAMS.fallback];
  }
};

export const generateMetadata = async ({ params }: PageProps<'/[locale]/builds/[tank]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { tank } = await params;
  const t = await getTranslations({ locale, namespace: 'builds.meta' });
  const name = await nameOf(tank);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.build(tank),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <Suspense>
    <BuildPage />
  </Suspense>
);

export default Page;
