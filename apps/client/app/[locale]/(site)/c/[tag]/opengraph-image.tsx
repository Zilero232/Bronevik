import { ImageResponse } from 'next/og';

import { getClan } from '@/entities/clan/clan';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { OG_SIZE } from '@/shared/seo/og';
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
    const page = await getClan({ idOrTag: decodeURIComponent(tag) });

    return new ImageResponse(<EntityOgCard {...clanOgCard({ page, locale, host })} />, { ...OG_SIZE, fonts });
  } catch {
    return new ImageResponse(<FallbackOgCard host={host} labels={ogLabels(locale)} />, { ...OG_SIZE, fonts });
  }
};

export default Image;
