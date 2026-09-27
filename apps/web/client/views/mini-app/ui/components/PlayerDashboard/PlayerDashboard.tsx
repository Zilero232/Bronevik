'use client';

import { ErrorState } from '@/ui-kit';

import type { PlayerDashboardProps } from './PlayerDashboard.types';

import { usePlayerDigest } from '../../../model/hooks';
import { MarksCard } from '../MarksCard';
import { PlayerHeader } from '../PlayerHeader';
import { QuickLinks } from '../QuickLinks';
import { SessionCard } from '../SessionCard';
import { StatGrid } from '../StatGrid';

import s from './PlayerDashboard.module.scss';

export const PlayerDashboard = ({ accountId, nickname }: PlayerDashboardProps) => {
  const { profile, session, marks, isError, isRetrying, retry } = usePlayerDigest(accountId);

  if (isError) {
    return <ErrorState isRetrying={isRetrying} onRetry={retry} />;
  }

  return (
    <div className={s.root}>
      <PlayerHeader nickname={nickname} summary={profile?.summary} />
      <StatGrid stats={profile?.summary.overall} />
      <SessionCard nickname={nickname} session={session} />
      <MarksCard marks={marks} />
      <QuickLinks nickname={nickname} />
    </div>
  );
};
