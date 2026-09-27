import { ImageResponse } from 'next/og';

import { getPlayer } from '@/entities/player/profile';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { OG_SIZE } from '@/shared/seo/og';
import { loadOgFonts } from '@/shared/seo/og/server';
import { FallbackOgCard, ogLabels, PlayerOgCard } from '@/views/player-og';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/p/[nick]'>) => {
  const { locale: rawLocale, nick } = await params;
  const locale = resolveLocale(rawLocale);
  const labels = ogLabels(locale);
  const host = new URL(SITE.url).host;
  const fonts = await loadOgFonts();

  try {
    const profile = await getPlayer({ idOrNick: decodeURIComponent(nick) });

    return new ImageResponse(<PlayerOgCard host={host} labels={labels} locale={locale} profile={profile} />, { ...OG_SIZE, fonts });
  } catch {
    return new ImageResponse(<FallbackOgCard host={host} labels={labels} />, { ...OG_SIZE, fonts });
  }
};

export default Image;
