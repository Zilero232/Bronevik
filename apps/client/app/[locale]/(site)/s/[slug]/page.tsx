import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata, streamerRouteName } from '@/shared/seo';
import { StreamerPage } from '@/views/streamer';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/s/[slug]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const slug = decodeURIComponent((await params).slug);
  const t = await getTranslations({ locale, namespace: 'streamer.publicMeta' });
  const name = await streamerRouteName(slug);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.streamers.profile(slug),
    locale,
    index: true,
    follow: true
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
