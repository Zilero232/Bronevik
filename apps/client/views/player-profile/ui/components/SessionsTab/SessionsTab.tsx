'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';
import { SessionDetail } from '@/widgets/player/session-detail';

import { SESSIONS } from '../../../config';
import { useSessionsTab } from '../../../model/hooks';
import { SessionList } from './components';

import s from './SessionsTab.module.scss';

export const SessionsTab = () => {
  const t = useTranslations('profile.sessions');
  const { accountId, nickname, items, isEmpty, hasMore, selectedId, isPending, isError, isFetching, isRetrying, select, showMore, retry } =
    useSessionsTab();

  if (isError) {
    return <ErrorState isRetrying={isRetrying} onRetry={retry} />;
  }

  if (isEmpty) {
    return <EmptyState title={t('empty')} />;
  }

  return (
    <div className={s.root}>
      {isPending ? (
        <Skeleton className={s.listSkeleton} height={SESSIONS.skeletonHeight} shape='block' />
      ) : (
        <SessionList hasMore={hasMore} isFetching={isFetching} items={items} selectedId={selectedId} onMore={showMore} onSelect={select} />
      )}
      <div className={s.detail}>{selectedId && <SessionDetail accountId={accountId} nickname={nickname} sessionId={selectedId} />}</div>
    </div>
  );
};
