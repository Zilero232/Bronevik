import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { clanRouteEntity, topClanTags } from '@/entities/clan/clan/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { clanJsonLd, JsonLd } from '@/shared/seo/json-ld';
import { PrefetchBoundary } from '@/shared/seo/prefetch-boundary';
import { RequestTime } from '@/shared/seo/request-time';
import { requireRouteEntity } from '@/shared/seo/require-route-entity';
import { ClanPage } from '@/views/clan';
import { clanPageState } from '@/views/clan/server';

export const generateStaticParams = async () => (await topClanTags({ fallback: ROUTE_STATIC_PARAMS.fallback.clan })).map((tag) => ({ tag }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/c/[tag]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const tag = decodeRouteParam((await params).tag);
  const t = await getTranslations({ locale, namespace: 'clans.clanMeta' });
  const { name } = await requireRouteEntity(clanRouteEntity(tag));

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.clans.detail(tag),
    locale,
    index: true,
    follow: true,
    hasOwnImage: true
  });
};

const Page = async ({ params }: PageProps<'/[locale]/c/[tag]'>) => {
  const tag = decodeRouteParam((await params).tag);
  const { name } = await requireRouteEntity(clanRouteEntity(tag));
  const locale = resolveLocale(await rootParams.locale());

  return (
    <>
      <JsonLd data={clanJsonLd({ name, path: ROUTES.clans.detail(tag), locale })} />
      <Suspense>
        <PrefetchBoundary state={clanPageState(tag)}>
          <ClanPage />
        </PrefetchBoundary>
      </Suspense>
      <Suspense>
        <RequestTime />
      </Suspense>
    </>
  );
};

export default Page;
