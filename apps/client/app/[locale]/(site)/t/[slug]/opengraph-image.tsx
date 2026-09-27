import { ImageResponse } from 'next/og';

import { getTank } from '@/entities/tank/tank';
import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { OG_SIZE } from '@/shared/seo/og';
import { loadOgFonts } from '@/shared/seo/og/server';
import { EntityOgCard, tankOgCard } from '@/views/entity-og';
import { FallbackOgCard, ogLabels } from '@/views/player-og';

export const size = OG_SIZE;

export const contentType = 'image/png';

export const alt = SITE.name;

const Image = async ({ params }: PageProps<'/[locale]/t/[slug]'>) => {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const host = new URL(SITE.url).host;
  const fonts = await loadOgFonts();

  try {
    const tank = await getTank({ idOrSlug: slug });

    return new ImageResponse(<EntityOgCard {...tankOgCard({ tank, kind: 'tank', locale, host })} />, { ...OG_SIZE, fonts });
  } catch {
    return new ImageResponse(<FallbackOgCard host={host} labels={ogLabels(locale)} />, { ...OG_SIZE, fonts });
  }
};

export default Image;
