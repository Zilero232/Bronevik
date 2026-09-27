'use client';

import type { PlayerProfile } from '@otmetki/schemas';

import { useEffect } from 'react';

import { useRecentPlayers } from '@/entities/player/recent-players';

export const useRememberPlayer = (profile: PlayerProfile | undefined) => {
  const { remember } = useRecentPlayers();

  const accountId = profile?.summary.accountId;

  useEffect(() => {
    if (!profile) {
      return;
    }

    const { summary } = profile;

    remember({ accountId: summary.accountId, nickname: summary.nickname, clanTag: summary.clan?.tag ?? null, wn8: summary.overall.wn8.value });
    // eslint-disable-next-line react/exhaustive-deps -- record a visit once per loaded account; remember is rebuilt every render
  }, [accountId]);
};
