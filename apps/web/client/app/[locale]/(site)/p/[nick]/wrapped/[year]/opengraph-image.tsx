import { playerWrappedOgSource } from '@/entities/player/profile/server';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { OG_SIZE } from '@/shared/seo/og';
import { WrappedOgCard } from '@/views/player-og';
import { ogImage } from '@/views/player-og/server';
import { parseWrappedYear } from '@/views/player-wrapped';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/p/[nick]/wrapped/[year]'>) => {
  const { locale: rawLocale, nick, year: rawYear } = await params;
  const locale = resolveLocale(rawLocale);
  const year = parseWrappedYear(rawYear);

  return ogImage({
    locale,
    card: async ({ host, labels }) => {
      if (year === null) {
        throw new Error('Invalid wrapped year');
      }

      const { nickname, wrapped } = await playerWrappedOgSource({ idOrNick: decodeRouteParam(nick), year });

      return <WrappedOgCard host={host} labels={labels} locale={locale} nickname={nickname} wrapped={wrapped} />;
    }
  });
};

export default Image;
