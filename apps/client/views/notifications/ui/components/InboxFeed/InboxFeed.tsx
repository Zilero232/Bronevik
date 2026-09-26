'use client';

import { useTranslations } from 'next-intl';

import { Button, Card } from '@/ui-kit';

import { useInboxFeed } from '../../../model/hooks';
import { InboxFeedBody } from '../InboxFeedBody';
import { InboxFeedHeader } from '../InboxFeedHeader';

import s from './InboxFeed.module.scss';

export const InboxFeed = () => {
  const t = useTranslations('notifications.feed');
  const {
    filter,
    days,
    unread,
    isEmpty,
    isPending,
    isError,
    isRetrying,
    hasNextPage,
    isFetchingNextPage,
    setFilter,
    onSelect,
    onMarkAll,
    onRetry,
    onLoadMore
  } = useInboxFeed();

  return (
    <Card className={s.root} padding='none'>
      <InboxFeedHeader filter={filter} unread={unread} onFilterChange={setFilter} onMarkAll={onMarkAll} />
      <InboxFeedBody
        days={days}
        filter={filter}
        isEmpty={isEmpty}
        isError={isError}
        isPending={isPending}
        isRetrying={isRetrying}
        onRetry={onRetry}
        onSelect={onSelect}
      />
      {hasNextPage && (
        <div className={s.more}>
          <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={onLoadMore}>
            {t('loadMore')}
          </Button>
        </div>
      )}
    </Card>
  );
};
