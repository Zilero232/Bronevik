import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { streamerRouteEntity } from '@/entities/streamer/streamer/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { StreamerPage } from '@/views/streamer';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/s/[slug]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const slug = decodeURIComponent((await params).slug);
  const t = await getTranslations({ locale, namespace: 'streamer.publicMeta' });
  const { name, isFound } = await streamerRouteEntity(slug);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.streamers.profile(slug),
    locale,
    index: isFound,
    follow: isFound
  });
};

const StreamerRoute = async ({ params }: Pick<PageProps<'/[locale]/s/[slug]'>, 'params'>) => {
  const { slug } = await params;

  return <StreamerPage slug={decodeURIComponent(slug)} />;
};

const Page = ({ params }: PageProps<'/[locale]/s/[slug]'>) => (
  <Suspense>
    <StreamerRoute params={params} />
  </Suspense>
);

export default Page;
