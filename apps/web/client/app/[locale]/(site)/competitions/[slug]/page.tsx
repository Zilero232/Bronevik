import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { createPageMetadata } from '@/shared/seo';
import { CompetitionPage } from '@/views/competition';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/competitions/[slug]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const slug = decodeRouteParam((await params).slug);
  const t = await getTranslations({ locale, namespace: 'competitions.detailMeta' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.competitions.detail(slug),
    locale,
    index: true,
    follow: true
  });
};

const CompetitionRoute = async ({ params }: Pick<PageProps<'/[locale]/competitions/[slug]'>, 'params'>) => {
  const { slug } = await params;

  return <CompetitionPage slug={decodeRouteParam(slug)} />;
};

const Page = ({ params }: PageProps<'/[locale]/competitions/[slug]'>) => (
  <Suspense>
    <CompetitionRoute params={params} />
  </Suspense>
);

export default Page;
