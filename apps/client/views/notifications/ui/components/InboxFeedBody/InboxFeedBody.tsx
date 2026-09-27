'use client';

import { BellOff, CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { EmptyState, ErrorState, QueryState, Skeleton } from '@/ui-kit';

import { INBOX_FEED } from '../../../config';
import { useInboxFeed } from '../../../model/hooks';
import { InboxFeedDay } from '../InboxFeedDay';

import s from './InboxFeedBody.module.scss';

export const InboxFeedBody = () => {
  const t = useTranslations('notifications.feed');
  const { filter, query } = useInboxFeed();

  return (
    <QueryState
      empty={
        filter === 'unread' ? (
          <EmptyState
            className={s.empty}
            description={t('emptyUnread.description')}
            icon={<CheckCheck size={34} strokeWidth={1.5} />}
            title={t('emptyUnread.title')}
          />
        ) : (
          <EmptyState
            className={s.empty}
            description={t('empty.description')}
            icon={<BellOff size={34} strokeWidth={1.5} />}
            title={t('empty.title')}
          />
        )
      }
      skeleton={
        <div aria-busy className={s.skeleton}>
          <Skeleton count={INBOX_FEED.skeletonRows} height={72} shape='block' />
        </div>
      }
      errorState={<ErrorState className={s.empty} isRetrying={query.isRefetching} title={t('error')} onRetry={() => void query.refetch()} />}
      query={query}
    >
      {(days) => (
        <div className={s.days}>
          {days.map((day) => (
            <InboxFeedDay key={day.key} day={day} />
          ))}
        </div>
      )}
    </QueryState>
  );
};
