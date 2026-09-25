'use client';

import type { InboxItem } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';

import { useMarkInboxRead } from '@/entities/notification/inbox';
import { Button, Card } from '@/ui-kit';

import { useInboxFeed } from '../../../model/hooks';
import { InboxFeedBody } from '../InboxFeedBody';
import { InboxFeedHeader } from '../InboxFeedHeader';

import s from './InboxFeed.module.scss';

export const InboxFeed = () => {
  const t = useTranslations('notifications.feed');
  const { filter, days, unread, isEmpty, isPending, isError, hasNextPage, isFetchingNextPage, setFilter, loadMore } = useInboxFeed();
  const markRead = useMarkInboxRead();

  const onSelect = ({ id, readAt }: InboxItem) => {
    if (readAt === null) {
      markRead.mutate({ ids: [id] });
    }
  };

  return (
    <Card className={s.root} padding='none'>
      <InboxFeedHeader filter={filter} unread={unread} onFilterChange={setFilter} onMarkAll={() => markRead.mutate({})} />
      <InboxFeedBody days={days} filter={filter} isEmpty={isEmpty} isError={isError} isPending={isPending} onSelect={onSelect} />
      {hasNextPage && (
        <div className={s.more}>
          <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={() => void loadMore()}>
            {t('loadMore')}
          </Button>
        </div>
      )}
    </Card>
  );
};
