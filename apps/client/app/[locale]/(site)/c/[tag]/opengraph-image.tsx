import { ImageResponse } from 'next/og';

import { clanOgSource } from '@/entities/clan/clan/server';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { decodeRouteParam } from '@/shared/lib/route-param';
import { OG_SIZE } from '@/shared/seo/og';
import { OG_CACHE } from '@/shared/seo/og-request';
import { loadOgFonts } from '@/shared/seo/og/server';
import { clanOgCard, EntityOgCard } from '@/views/entity-og';
import { FallbackOgCard, ogLabels } from '@/views/player-og';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/c/[tag]'>) => {
  const { locale: rawLocale, tag } = await params;
  const locale = resolveLocale(rawLocale);
  const host = new URL(SITE.url).host;
  const fonts = await loadOgFonts();

  try {
    const page = await clanOgSource(decodeRouteParam(tag));

    return new ImageResponse(<EntityOgCard {...clanOgCard({ page, locale, host })} />, {
      ...OG_SIZE,
      fonts,
      headers: { 'Cache-Control': OG_CACHE.image }
    });
  } catch {
    return new ImageResponse(<FallbackOgCard host={host} labels={ogLabels(locale)} />, {
      ...OG_SIZE,
      fonts,
      headers: { 'Cache-Control': OG_CACHE.missing }
    });
  }
};

export default Image;
