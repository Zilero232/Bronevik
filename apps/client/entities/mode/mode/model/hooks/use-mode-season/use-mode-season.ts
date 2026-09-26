'use client';

import type { ModeSeason } from '@otmetki/schemas';

import { safeWebHref, useClientNow } from '@/shared/lib';

import { seasonPhase } from '../../../lib/season-phase';

export const useModeSeason = (season: ModeSeason) => {
  const now = useClientNow();

  return {
    phase: now ? seasonPhase({ season, now }) : null,
    href: safeWebHref(season.url),
    startsAt: new Date(season.startsAt),
    endsAt: season.endsAt ? new Date(season.endsAt) : null
  };
};
