'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { usePlatoonBoard } from '../../../model/hooks';
import { PlatoonCard } from './components';

import s from './PlatoonBoard.module.scss';

export const PlatoonBoard = () => {
  const t = useTranslations('platoons.board');
  const { items, total, isFiltered, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, onReset, loadMore, retry } = usePlatoonBoard();

  if (isError && items.length === 0) {
    return <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />;
  }

  if (isPending) {
    return (
      <div className={s.list}>
        <Skeleton height={148} />
        <Skeleton height={148} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
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
    );
  }

  return (
    <section aria-label={t('title')} className={s.root}>
      <p className={s.count}>{t('count', { total })}</p>
      <ul className={s.list}>
        {items.map((post) => (
          <li key={post.id}>
            <PlatoonCard post={post} />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <Button className={s.more} disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
          {t('more')}
        </Button>
      )}
    </section>
  );
};
