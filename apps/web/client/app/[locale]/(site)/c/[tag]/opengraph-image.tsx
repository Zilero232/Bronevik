import { clanOgSource } from '@/entities/clan/clan/server';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { OG_SIZE } from '@/shared/seo/og';
import { clanOgCard, EntityOgCard } from '@/views/entity-og';
import { ogImage } from '@/views/player-og/server';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/c/[tag]'>) => {
  const { locale: rawLocale, tag } = await params;
  const locale = resolveLocale(rawLocale);

  return ogImage({
    locale,
    card: async ({ host }) => <EntityOgCard {...clanOgCard({ page: await clanOgSource(decodeRouteParam(tag)), locale, host })} />
  });
};

export default Image;
