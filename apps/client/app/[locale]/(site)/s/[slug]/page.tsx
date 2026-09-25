import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { getStreamerBySlug } from '@/shared/api/streamers';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { StreamerPage } from '@/views/streamer';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const nameOf = async (slug: string) => {
  'use cache';

  try {
    return (await getStreamerBySlug(slug)).displayName;
  } catch {
    return slug;
  }
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const slug = decodeURIComponent((await params).slug);
  const t = await getTranslations({ locale, namespace: 'streamer.publicMeta' });
  const name = await nameOf(slug);

  return createPageMetadata({
    title: t('title', { name }),
    description: t('description', { name }),
    path: ROUTES.streamer(slug),
    locale,
    index: true,
    follow: true
  });
};

const StreamerRoute = async ({ params }: PageProps) => {
  const { slug } = await params;

  return <StreamerPage slug={decodeURIComponent(slug)} />;
};

const Page = ({ params }: PageProps) => (
  <Suspense>
    <StreamerRoute params={params} />
  </Suspense>
);

export default Page;
