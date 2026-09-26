'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, EmptyState, PagedList } from '@/ui-kit';

import { usePlatoonBoard } from '../../../model/hooks';
import { PlatoonCard } from './components';

export const PlatoonBoard = () => {
  const t = useTranslations('platoons.board');
  const { items, total, isFiltered, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, onReset, loadMore, retry } = usePlatoonBoard();

  return (
    <PagedList
      empty={
        <Card padding='none'>
          <EmptyState
            action={
              isFiltered && (
                <Button size='sm' variant='secondary' onClick={onReset}>
                  {t('reset')}
                </Button>
              )
            }
            description={isFiltered ? t('emptyFilteredDescription') : t('emptyDescription')}
            title={t('emptyTitle')}
          />
        </Card>
      }
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      getKey={(post) => post.id}
      hasNextPage={hasNextPage}
      header={t('count', { total })}
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
      isRetrying={isRetrying}
      items={items}
      label={t('title')}
      renderItem={(post) => <PlatoonCard post={post} />}
      onLoadMore={loadMore}
      onRetry={retry}
    />
  );
};
