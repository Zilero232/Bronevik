import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { createPageMetadata } from '@/shared/seo';
import { PageHeroFallback } from '@/ui-kit';
import { PlayerSessionPage } from '@/views/player-session';

export const generateMetadata = async ({ params }: PageProps<'/[locale]/p/[nick]/sessions/[sessionId]'>): Promise<Metadata> => {
  const locale = resolveLocale(await rootParams.locale());
  const { nick, sessionId } = await params;
  const nickname = decodeRouteParam(nick);
  const t = await getTranslations({ locale, namespace: 'profile.sessions.meta' });

  return createPageMetadata({
    title: t('title', { nickname }),
    description: t('description', { nickname }),
    path: ROUTES.players.session({ nickname, sessionId }),
    locale,
    hasOwnImage: true
  });
};

const SessionRoute = async ({ params }: Pick<PageProps<'/[locale]/p/[nick]/sessions/[sessionId]'>, 'params'>) => {
  const { nick, sessionId } = await params;

  return <PlayerSessionPage nickname={decodeRouteParam(nick)} sessionId={sessionId} />;
};

const Page = ({ params }: PageProps<'/[locale]/p/[nick]/sessions/[sessionId]'>) => (
  <Suspense fallback={<PageHeroFallback />}>
    <SessionRoute params={params} />
  </Suspense>
);

export default Page;
