import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { clanRouteEntity, topClanTags } from '@/entities/clan/clan/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, ROUTE_STATIC_PARAMS } from '@/shared/seo';
import { clanJsonLd } from '@/shared/seo/json-ld';
import { PrefetchBoundary } from '@/shared/seo/prefetch-boundary';
import { RequestTime } from '@/shared/seo/request-time';
import { RouteGuard } from '@/shared/seo/route-guard';
import { ClanPage } from '@/views/clan';
import { clanPageState } from '@/views/clan/server';

export const generateStaticParams = async () => (await topClanTags({ fallback: ROUTE_STATIC_PARAMS.fallback.clan })).map((tag) => ({ tag }));

export const generateMetadata = async ({ params }: PageProps<'/[locale]/c/[tag]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { tag } = await params;
  const t = await getTranslations({ locale, namespace: 'clans.clanMeta' });
  const { name, isFound } = await clanRouteEntity(tag);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.clans.detail(tag),
    locale,
    index: isFound,
    follow: isFound,
    hasOwnImage: true
  });
};

const Page = ({ params }: PageProps<'/[locale]/c/[tag]'>) => (
  <>
    <Suspense>
      <RouteGuard
        schema={async ({ name }) =>
          clanJsonLd({ name, path: ROUTES.clans.detail((await params).tag), locale: resolveLocale(await rootParams.locale()) })
        }
        entity={params.then(({ tag }) => clanRouteEntity(tag))}
      />
    </Suspense>
    <Suspense>
      <PrefetchBoundary state={params.then(({ tag }) => clanPageState(decodeURIComponent(tag)))}>
        <ClanPage />
      </PrefetchBoundary>
    </Suspense>
    <Suspense>
      <RequestTime />
    </Suspense>
  </>
);

export default Page;
