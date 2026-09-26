'use client';

import { useTranslations } from 'next-intl';

import { Card, EmptyState, PagedList } from '@/ui-kit';

import type { RecruitingBoardProps } from './RecruitingBoard.types';

import { useRecruitingBoard } from '../../../model/hooks';
import { RecruitingCard } from './components';

export const RecruitingBoard = ({ kind }: RecruitingBoardProps) => {
  const t = useTranslations('recruiting.board');
  const { items, total, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, loadMore, retry } = useRecruitingBoard(kind);

  return (
    <PagedList
      empty={
        <Card padding='none'>
          <EmptyState description={t(`empty.${kind}`)} title={t('emptyTitle')} />
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
      renderItem={(post) => <RecruitingCard post={post} />}
      skeletonHeight={160}
      onLoadMore={loadMore}
      onRetry={retry}
    />
  );
};
