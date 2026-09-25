import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { getMap, listMaps } from '@/shared/api/maps';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { MapPage } from '@/views/map';

type PageProps = {
  params: Promise<{ id: string }>;
};

const nameOf = async (value: string) => {
  'use cache';

  try {
    return (await getMap({ idOrSlug: value })).name;
  } catch {
    return decodeURIComponent(value);
  }
};

const STATIC_PARAMS = { limit: 20, fallback: [{ id: '01-karelia' }] } as const;

export const generateStaticParams = async () => {
  'use cache';

  try {
    const params = (await listMaps({})).map(({ slug }) => ({ id: slug }));

    return params.length > 0 ? params : [...STATIC_PARAMS.fallback];
  } catch {
    return [...STATIC_PARAMS.fallback];
  }
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { id } = await params;
  const t = await getTranslations({ locale, namespace: 'maps.mapMeta' });
  const name = await nameOf(id);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.map(id),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <Suspense>
    <MapPage />
  </Suspense>
);

export default Page;
