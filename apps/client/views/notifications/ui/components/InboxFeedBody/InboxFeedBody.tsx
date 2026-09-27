'use client';

import { BellOff, CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { INBOX_FEED } from '../../../config';
import { useInboxFeed } from '../../../model/hooks';
import { InboxFeedDay } from '../InboxFeedDay';

import s from './InboxFeedBody.module.scss';

export const InboxFeedBody = () => {
  const t = useTranslations('notifications.feed');
  const { filter, days, isEmpty, isPending, isError, isRetrying, onRetry } = useInboxFeed();

  return match({ isPending, isError, isEmpty, filter })
    .with({ isPending: true }, () => (
      <div aria-busy className={s.skeleton}>
        <Skeleton count={INBOX_FEED.skeletonRows} height={72} shape='block' />
      </div>
    ))
    .with({ isError: true }, () => <ErrorState className={s.empty} isRetrying={isRetrying} title={t('error')} onRetry={onRetry} />)
    .with({ isEmpty: true, filter: 'unread' }, () => (
      <EmptyState
        className={s.empty}
        description={t('emptyUnread.description')}
        icon={<CheckCheck size={34} strokeWidth={1.5} />}
        title={t('emptyUnread.title')}
      />
    ))
    .with({ isEmpty: true }, () => (
      <EmptyState className={s.empty} description={t('empty.description')} icon={<BellOff size={34} strokeWidth={1.5} />} title={t('empty.title')} />
    ))
    .otherwise(() => (
      <div className={s.days}>
        {days.map((day) => (
          <InboxFeedDay key={day.key} day={day} />
        ))}
      </div>
    ));
};
