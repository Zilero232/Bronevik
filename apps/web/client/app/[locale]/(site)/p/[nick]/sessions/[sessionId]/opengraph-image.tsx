import { ImageResponse } from 'next/og';

import { playerSessionOgSource } from '@/entities/player/profile/server';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { OG_SIZE } from '@/shared/seo/og';
import { OG_CACHE } from '@/shared/seo/og-request';
import { loadOgFonts } from '@/shared/seo/og/server';
import { FallbackOgCard, ogLabels, SessionOgCard } from '@/views/player-og';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/p/[nick]/sessions/[sessionId]'>) => {
  const { locale: rawLocale, nick, sessionId } = await params;
  const locale = resolveLocale(rawLocale);
  const labels = ogLabels(locale);
  const fonts = await loadOgFonts();

  try {
    const { nickname, session } = await playerSessionOgSource({ idOrNick: decodeRouteParam(nick), sessionId });

    return new ImageResponse(<SessionOgCard labels={labels} locale={locale} nickname={nickname} session={session} />, {
      ...OG_SIZE,
      fonts,
      headers: { 'Cache-Control': OG_CACHE.image }
    });
  } catch {
    return new ImageResponse(<FallbackOgCard host={new URL(SITE.url).host} labels={labels} />, {
      ...OG_SIZE,
      fonts,
      headers: { 'Cache-Control': OG_CACHE.missing }
    });
  }
};

export default Image;
