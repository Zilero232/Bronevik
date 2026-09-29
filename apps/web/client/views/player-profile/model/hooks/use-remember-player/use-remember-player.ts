'use client';

import type { PlayerProfile } from '@otmetki/schemas';

import { useEffect, useEffectEvent } from 'react';

import { useRecentPlayers } from '@/entities/player/recent-players';

export const useRememberPlayer = (profile: PlayerProfile | undefined) => {
  const { remember } = useRecentPlayers();

  const accountId = profile?.summary.accountId;

  const recordVisit = useEffectEvent(() => {
    if (!profile) {
      return;
    }

    const { summary } = profile;

    remember({ accountId: summary.accountId, nickname: summary.nickname, clanTag: summary.clan?.tag ?? null, wn8: summary.overall.wn8.value });
  });

  useEffect(() => {
    recordVisit();
  }, [accountId]);
};
