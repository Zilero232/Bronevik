import { ImageResponse } from 'next/og';

import { getPlayer, getPlayerSession } from '@/entities/player/profile';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { loadOgFonts, OG_SIZE } from '@/shared/seo/og';
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
    const { summary } = await getPlayer({ idOrNick: decodeURIComponent(nick) });
    const session = await getPlayerSession({ accountId: summary.accountId, sessionId });

    return new ImageResponse(<SessionOgCard labels={labels} locale={locale} nickname={summary.nickname} session={session} />, { ...OG_SIZE, fonts });
  } catch {
    return new ImageResponse(<FallbackOgCard host={new URL(SITE.url).host} labels={labels} />, { ...OG_SIZE, fonts });
  }
};

export default Image;
