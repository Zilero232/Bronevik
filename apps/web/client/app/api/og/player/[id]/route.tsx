import type { NextRequest } from 'next/server';

import { getPlayer } from '@/entities/player/profile';
import { isNotFoundError } from '@/shared/api/source';
import { OG_REQUEST, ogNotFound, parseOgPlayerRequest } from '@/shared/seo/og-request';
import { PlayerOgCard } from '@/views/player-og';
import { ogImage } from '@/views/player-og/server';

export const GET = async (request: NextRequest, { params }: RouteContext<'/api/og/player/[id]'>) => {
  const { id } = await params;
  const parsed = parseOgPlayerRequest({ id, locale: request.nextUrl.searchParams.get(OG_REQUEST.localeParam) });

  if (!parsed) {
    return ogNotFound();
  }

  const { accountId, locale } = parsed;

  return ogImage({
    locale,
    card: async ({ host, labels }) => (
      <PlayerOgCard host={host} labels={labels} locale={locale} profile={await getPlayer({ idOrNick: String(accountId) })} />
    ),
    onError: (error) => (isNotFoundError(error) ? ogNotFound() : null)
  });
};
