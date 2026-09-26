import type { NextRequest } from 'next/server';

import { ImageResponse } from 'next/og';

import { getPlayer } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';
import { SITE } from '@/shared/config/site';
import { loadOgFonts, OG_SIZE } from '@/shared/seo/og';
import { OG_CACHE, OG_REQUEST, ogNotFound, parseOgPlayerRequest } from '@/shared/seo/og-request';
import { FallbackOgCard, ogLabels, PlayerOgCard } from '@/views/player-og';

export const GET = async (request: NextRequest, { params }: RouteContext<'/api/og/player/[id]'>) => {
  const { id } = await params;
  const parsed = parseOgPlayerRequest({ id, locale: request.nextUrl.searchParams.get(OG_REQUEST.localeParam) });

  if (!parsed) {
    return ogNotFound();
  }

  const { accountId, locale } = parsed;
  const labels = ogLabels(locale);
  const host = new URL(SITE.url).host;
  const fonts = await loadOgFonts();

  try {
    const profile = await getPlayer({ idOrNick: String(accountId) });

    return new ImageResponse(<PlayerOgCard host={host} labels={labels} locale={locale} profile={profile} />, {
      ...OG_SIZE,
      fonts,
      headers: { 'Cache-Control': OG_CACHE.image }
    });
  } catch (error) {
    if (isNotFoundError(error)) {
      return ogNotFound();
    }

    return new ImageResponse(<FallbackOgCard host={host} labels={labels} />, { ...OG_SIZE, fonts, headers: { 'Cache-Control': OG_CACHE.missing } });
  }
};
