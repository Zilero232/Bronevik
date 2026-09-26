import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { clanRouteName, createPageMetadata, ROUTE_STATIC_PARAMS, topClanTags } from '@/shared/seo';
import { ClanPage } from '@/views/clan';

export const generateStaticParams = async () => (await topClanTags({ fallback: ROUTE_STATIC_PARAMS.fallback.clan })).map((tag) => ({ tag }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/c/[tag]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { tag } = await params;
  const t = await getTranslations({ locale, namespace: 'clans.clanMeta' });
  const name = await clanRouteName(tag);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.clan(tag),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <Suspense>
    <ClanPage />
  </Suspense>
);

export default Page;
