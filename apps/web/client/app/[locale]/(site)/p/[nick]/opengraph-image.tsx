import { playerOgSource } from '@/entities/player/profile/server';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { OG_SIZE } from '@/shared/seo/og';
import { PlayerOgCard } from '@/views/player-og';
import { ogImage } from '@/views/player-og/server';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/p/[nick]'>) => {
  const { locale: rawLocale, nick } = await params;
  const locale = resolveLocale(rawLocale);

  return ogImage({
    locale,
    card: async ({ host, labels }) => (
      <PlayerOgCard host={host} labels={labels} locale={locale} profile={await playerOgSource(decodeRouteParam(nick))} />
    )
  });
};

export default Image;
