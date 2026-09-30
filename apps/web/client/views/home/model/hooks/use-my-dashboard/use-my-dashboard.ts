'use client';

import { closestMarks } from '@/entities/player/marks';
import { forgetOwnPlayer, useOwnPlayer } from '@/entities/player/own-player';
import { usePlayerDigest } from '@/entities/player/profile';
import { periodStats } from '@/entities/player/stats';
import { isNotFoundError } from '@/shared/api/source';

import { HOME } from '../../../config';
import { dashboardState } from '../../../lib/dashboard-state';

export const useMyDashboard = () => {
  const { isReady, player } = useOwnPlayer();
  const { profile, session, marks, profileError, isError, isRetrying, retry } = usePlayerDigest(player?.accountId ?? null);

  return {
    state: dashboardState({
      isReady,
      hasPlayer: player !== null,
      hasProfile: profile !== undefined,
      isMissing: isNotFoundError(profileError),
      isError
    }),
    nickname: profile?.summary.nickname ?? player?.nickname ?? '',
    profile,
    week: profile ? periodStats({ overall: profile.summary.overall, recent: profile.recent, period: HOME.dashboard.weekPeriod }) : null,
    session,
    marks: marks ? { summary: marks.summary, closest: closestMarks({ items: marks.items, limit: HOME.dashboard.marks }) } : undefined,
    isRetrying,
    retry,
    forget: forgetOwnPlayer
  };
};
