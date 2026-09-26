'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { StatsTiles } from '@/entities/player/stats';
import { isNotFoundError } from '@/shared/api/source';
import { EmptyState, RetryButton, Skeleton } from '@/ui-kit';

import type { SessionDetailProps } from './SessionDetail.types';

import { SESSION_DETAIL } from '../config';
import { useSessionDetail } from '../model/hooks';
import { SessionBattles, SessionHeader, SessionHighlights, SessionTanks } from './components';

import s from './SessionDetail.module.scss';

export const SessionDetail = ({ accountId, sessionId, nickname, withShare = true, className }: SessionDetailProps) => {
  const t = useTranslations('profile.sessions');
  const { data: session, isPending, isError, error, isFetching, refetch } = useSessionDetail({ accountId, sessionId });

  if (isError) {
    return (
      <EmptyState
        action={!isNotFoundError(error) && <RetryButton disabled={isFetching} size='sm' onClick={() => void refetch()} />}
        className={className}
        description={t('errorDescription')}
        title={t('errorTitle')}
      />
    );
  }

  if (isPending) {
    return (
      <div aria-busy className={clsx(s.root, className)}>
        {SESSION_DETAIL.skeletonHeights.map((height) => (
          <Skeleton key={height} height={height} shape='block' />
        ))}
      </div>
    );
  }

  return (
    <article className={clsx(s.root, className)}>
      <SessionHeader nickname={nickname} session={session} withShare={withShare} />
      <StatsTiles stats={session.stats} />
      <SessionHighlights best={session.best} worst={session.worst} />
      <SessionTanks tanks={session.tanks} />
      {session.battles && <SessionBattles battles={session.battles} />}
    </article>
  );
};
