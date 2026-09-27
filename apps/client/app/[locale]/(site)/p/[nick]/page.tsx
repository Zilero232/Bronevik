import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { playerRouteEntity } from '@/entities/player/profile/server';
import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { createPageMetadata } from '@/shared/seo';
import { RouteGuard } from '@/shared/seo/route-guard';
import { PlayerProfileFallback, PlayerProfilePage } from '@/views/player-profile';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/p/[nick]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'profile.meta' });
  const { name: nickname, isFound } = await playerRouteEntity(decodeURIComponent((await params).nick));

  return createPageMetadata({
    title: t('title', { nickname }),
    description: t('description', { nickname }),
    path: ROUTES.players.profile(nickname),
    locale,
    index: isFound,
    follow: isFound
  });
};

const ProfileRoute = async ({ params }: Pick<PageProps<'/[locale]/p/[nick]'>, 'params'>) => {
  const { nick } = await params;

  return <PlayerProfilePage nickname={decodeURIComponent(nick)} />;
};

const Page = ({ params }: PageProps<'/[locale]/p/[nick]'>) => (
  <>
    <Suspense>
      <RouteGuard entity={params.then(({ nick }) => playerRouteEntity(decodeURIComponent(nick)))} />
    </Suspense>
    <Suspense fallback={<PlayerProfileFallback />}>
      <ProfileRoute params={params} />
    </Suspense>
  </>
);

export default Page;
