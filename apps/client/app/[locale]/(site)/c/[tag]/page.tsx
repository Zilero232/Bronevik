import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { clanRouteName, topClanTags } from '@/entities/clan/clan/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { RequestTime } from '@/shared/seo/request-time';
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
    path: ROUTES.clans.detail(tag),
    locale,
    index: true,
    follow: true
  });
};

const Page = () => (
  <>
    <Suspense>
      <ClanPage />
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
