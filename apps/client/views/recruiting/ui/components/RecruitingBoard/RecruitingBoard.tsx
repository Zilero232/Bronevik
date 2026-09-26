'use client';

import { useTranslations } from 'next-intl';

import { Button, Card, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { RecruitingBoardProps } from './RecruitingBoard.types';

import { useRecruitingBoard } from '../../../model/hooks';
import { RecruitingCard } from './components';

import s from './RecruitingBoard.module.scss';

export const RecruitingBoard = ({ kind }: RecruitingBoardProps) => {
  const t = useTranslations('recruiting.board');
  const { items, total, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, loadMore, retry } = useRecruitingBoard(kind);

  if (isError && items.length === 0) {
    return <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />;
  }

  if (isPending) {
    return (
      <div className={s.list}>
        <Skeleton height={160} />
        <Skeleton height={160} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card padding='none'>
        <EmptyState description={t(`empty.${kind}`)} title={t('emptyTitle')} />
      </Card>
    );
  }

  return (
    <section className={s.root}>
      <p className={s.count}>{t('count', { total })}</p>
      <ul className={s.list}>
        {items.map((post) => (
          <li key={post.id}>
            <RecruitingCard post={post} />
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
