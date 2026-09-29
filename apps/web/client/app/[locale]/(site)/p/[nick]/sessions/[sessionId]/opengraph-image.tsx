import { playerSessionOgSource } from '@/entities/player/profile/server';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { OG_SIZE } from '@/shared/seo/og';
import { SessionOgCard } from '@/views/player-og';
import { ogImage } from '@/views/player-og/server';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/p/[nick]/sessions/[sessionId]'>) => {
  const { locale: rawLocale, nick, sessionId } = await params;
  const locale = resolveLocale(rawLocale);

  return ogImage({
    locale,
    card: async ({ labels }) => {
      const { nickname, session } = await playerSessionOgSource({ idOrNick: decodeRouteParam(nick), sessionId });

      return <SessionOgCard labels={labels} locale={locale} nickname={nickname} session={session} />;
    }
  });
};

export default Image;
