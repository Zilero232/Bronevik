import { ImageResponse } from 'next/og';

import { playerWrappedOgSource } from '@/entities/player/profile/server';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { OG_SIZE } from '@/shared/seo/og';
import { OG_CACHE } from '@/shared/seo/og-request';
import { loadOgFonts } from '@/shared/seo/og/server';
import { FallbackOgCard, ogLabels, WrappedOgCard } from '@/views/player-og';
import { parseWrappedYear } from '@/views/player-wrapped';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/p/[nick]/wrapped/[year]'>) => {
  const { locale: rawLocale, nick, year: rawYear } = await params;
  const locale = resolveLocale(rawLocale);
  const labels = ogLabels(locale);
  const host = new URL(SITE.url).host;
  const fonts = await loadOgFonts();
  const year = parseWrappedYear(rawYear);

  try {
    if (year === null) {
      throw new Error('Invalid wrapped year');
    }

    const { nickname, wrapped } = await playerWrappedOgSource({ idOrNick: decodeRouteParam(nick), year });

    return new ImageResponse(<WrappedOgCard host={host} labels={labels} locale={locale} nickname={nickname} wrapped={wrapped} />, {
      ...OG_SIZE,
      fonts,
      headers: { 'Cache-Control': OG_CACHE.image }
    });
  } catch {
    return new ImageResponse(<FallbackOgCard host={host} labels={labels} />, { ...OG_SIZE, fonts, headers: { 'Cache-Control': OG_CACHE.missing } });
  }
};

export default Image;
