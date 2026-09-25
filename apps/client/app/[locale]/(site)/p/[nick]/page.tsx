import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { PlayerProfileFallback, PlayerProfilePage } from '@/views/player-profile';

type PageProps = {
  params: Promise<{ nick: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const nickname = decodeURIComponent((await params).nick);
  const t = await getTranslations({ locale, namespace: 'profile.meta' });

  return createPageMetadata({
    title: t('title', { nickname }),
    description: t('description', { nickname }),
    path: ROUTES.player(nickname),
    locale,
    index: true,
    follow: true
  });
};

const ProfileRoute = async ({ params }: PageProps) => {
  const { nick } = await params;

  return <PlayerProfilePage nickname={decodeURIComponent(nick)} />;
};

const Page = ({ params }: PageProps) => (
  <Suspense fallback={<PlayerProfileFallback />}>
    <ProfileRoute params={params} />
  </Suspense>
);

export default Page;
