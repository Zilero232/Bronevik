import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { streamerRouteName } from '@/entities/streamer/streamer';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { StreamerSettingsPage } from '@/views/streamer-settings';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/s/[slug]/settings'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const slug = decodeURIComponent((await params).slug);
  const t = await getTranslations({ locale, namespace: 'streamerSettings.meta.streamer' });
  const name = await streamerRouteName(slug);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.streamers.settings.profile(slug),
    locale,
    index: true,
    follow: true
  });
};

const StreamerSettingsRoute = async ({ params }: Pick<PageProps<'/[locale]/s/[slug]/settings'>, 'params'>) => {
  const { slug } = await params;

  return <StreamerSettingsPage slug={decodeURIComponent(slug)} />;
};

const Page = ({ params }: PageProps<'/[locale]/s/[slug]/settings'>) => (
  <Suspense>
    <StreamerSettingsRoute params={params} />
  </Suspense>
);

export default Page;
