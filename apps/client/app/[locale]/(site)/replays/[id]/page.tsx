import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { ReplayPage } from '@/views/replay';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/replays/[id]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { id } = await params;
  const t = await getTranslations({ locale, namespace: 'replays.detailMeta' });

  return createPageMetadata({
    title: t('title'),
    description: t('description'),
    path: ROUTES.replay(decodeURIComponent(id)),
    locale,
    index: false,
    follow: true
  });
};

const ReplayRoute = async ({ params }: Pick<PageProps<'/[locale]/replays/[id]'>, 'params'>) => {
  const { id } = await params;

  return <ReplayPage id={decodeURIComponent(id)} />;
};

const Page = ({ params }: PageProps<'/[locale]/replays/[id]'>) => (
  <Suspense>
    <ReplayRoute params={params} />
  </Suspense>
);

export default Page;
