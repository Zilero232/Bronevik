import type { NextRequest } from 'next/server';

import { resolveLocale } from '@/shared/i18n';
import { OG_REQUEST } from '@/shared/seo/og-request';
import { EntityOgCard, siteOgCard } from '@/views/entity-og';
import { ogImage } from '@/views/player-og/server';

export const GET = async (request: NextRequest) => {
  const locale = resolveLocale(request.nextUrl.searchParams.get(OG_REQUEST.localeParam) ?? undefined);

  return ogImage({ locale, card: ({ host }) => <EntityOgCard {...siteOgCard({ locale, host })} /> });
};
