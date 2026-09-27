import type { NextRequest } from 'next/server';

import { ImageResponse } from 'next/og';

import { SITE } from '@/shared/config/site';
import { resolveLocale } from '@/shared/i18n';
import { OG_SIZE } from '@/shared/seo/og';
import { OG_CACHE, OG_REQUEST } from '@/shared/seo/og-request';
import { loadOgFonts } from '@/shared/seo/og/server';
import { EntityOgCard, siteOgCard } from '@/views/entity-og';

export const GET = async (request: NextRequest) => {
  const locale = resolveLocale(request.nextUrl.searchParams.get(OG_REQUEST.localeParam) ?? undefined);
  const fonts = await loadOgFonts();

  return new ImageResponse(<EntityOgCard {...siteOgCard({ locale, host: new URL(SITE.url).host })} />, {
    ...OG_SIZE,
    fonts,
    headers: { 'Cache-Control': OG_CACHE.image }
  });
};
