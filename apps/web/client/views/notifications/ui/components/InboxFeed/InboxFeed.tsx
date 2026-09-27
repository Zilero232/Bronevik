'use client';

import { useTranslations } from 'next-intl';

import { Button, Card } from '@/ui-kit';

import { useInboxFeedMore } from '../../../model/hooks';
import { InboxFeedBody } from '../InboxFeedBody';
import { InboxFeedHeader } from '../InboxFeedHeader';

import s from './InboxFeed.module.scss';

export const InboxFeed = () => {
  const t = useTranslations('notifications.feed');
  const { hasNextPage, isFetchingNextPage, onLoadMore } = useInboxFeedMore();

  return (
    <Card className={s.root} padding='none'>
      <InboxFeedHeader />
      <InboxFeedBody />
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
