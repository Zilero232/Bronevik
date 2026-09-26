import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { GuidePage } from '@/views/guide';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/guides/[slug]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const slug = decodeURIComponent((await params).slug);
  const t = await getTranslations({ locale, namespace: 'guides.detailMeta' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.guides.detail(slug),
    locale,
    index: true,
    follow: true
  });
};

const GuideRoute = async ({ params }: Pick<PageProps<'/[locale]/guides/[slug]'>, 'params'>) => {
  const { slug } = await params;

  return <GuidePage slug={decodeURIComponent(slug)} />;
};

const Page = ({ params }: PageProps<'/[locale]/guides/[slug]'>) => (
  <Suspense>
    <GuideRoute params={params} />
  </Suspense>
);

export default Page;
