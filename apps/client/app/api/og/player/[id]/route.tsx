import type { NextRequest } from 'next/server';

import { createTranslator } from 'next-intl';
import { ImageResponse } from 'next/og';

import { getPlayer } from '@/shared/api/players';
import { isNotFoundError } from '@/shared/api/source';
import { SITE } from '@/shared/config/site';
import { messages } from '@/shared/i18n';
import { loadOgFonts, OG_SIZE } from '@/shared/seo/og';
import { OG_CACHE, OG_REQUEST, parseOgPlayerRequest } from '@/shared/seo/og-request';
import { PlayerOgCard } from '@/views/player-og';

type RouteContext = {
  params: Promise<{ id: string }>;
};

const notFound = () => new Response(null, { status: 404, headers: { 'Cache-Control': OG_CACHE.missing } });

const loadPlayer = async (accountId: number) => {
  try {
    return await getPlayer({ idOrNick: String(accountId) });
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
};

export const GET = async (request: NextRequest, { params }: RouteContext) => {
  const { id } = await params;
  const parsed = parseOgPlayerRequest({ id, locale: request.nextUrl.searchParams.get(OG_REQUEST.localeParam) });

  if (!parsed) {
    return notFound();
  }

  const { accountId, locale } = parsed;
  const t = createTranslator({ locale, messages: messages[locale], namespace: 'profile.og' });
  const [profile, fonts] = await Promise.all([loadPlayer(accountId), loadOgFonts()]);

  if (!profile) {
    return notFound();
  }

  return new ImageResponse(
    <PlayerOgCard
      labels={{
        eyebrow: t('eyebrow'),
        broneIndex: t('broneIndex'),
        winRate: t('winRate'),
        battles: t('battles'),
        noClan: t('noClan'),
        source: t('source')
      }}
      host={new URL(SITE.url).host}
      profile={profile}
    />,
    { ...OG_SIZE, fonts, headers: { 'Cache-Control': OG_CACHE.image } }
  );
};
