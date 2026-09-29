'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { StatsTiles } from '@/entities/player/stats';
import { isNotFoundError } from '@/shared/api/source';
import { EmptyState, QueryState, RetryButton, SkeletonStack } from '@/ui-kit';

import type { SessionDetailProps } from './SessionDetail.types';

import { SESSION_DETAIL } from '../config';
import { useSessionDetail } from '../model/hooks';
import { SessionBattles, SessionHeader, SessionHighlights, SessionTanks } from './components';

import s from './SessionDetail.module.scss';

export const SessionDetail = ({ accountId, sessionId, nickname, withShare = true, className }: SessionDetailProps) => {
  const t = useTranslations('profile.sessions');
  const query = useSessionDetail({ accountId, sessionId });

  return (
    <QueryState
      errorState={
        <EmptyState
          action={!isNotFoundError(query.error) && <RetryButton disabled={query.isFetching} size='sm' onClick={() => void query.refetch()} />}
          className={className}
          description={t('errorDescription')}
          title={t('errorTitle')}
        />
      }
      query={query}
      skeleton={<SkeletonStack className={clsx(s.root, className)} heights={SESSION_DETAIL.skeletonHeights} />}
    >
      {(session) => (
        <article className={clsx(s.root, className)}>
          <SessionHeader nickname={nickname} session={session} withShare={withShare} />
          <StatsTiles stats={session.stats} />
          <SessionHighlights best={session.best} worst={session.worst} />
          <SessionTanks tanks={session.tanks} />
          {session.battles && <SessionBattles battles={session.battles} />}
        </article>
      )}
    </QueryState>
  );
};
