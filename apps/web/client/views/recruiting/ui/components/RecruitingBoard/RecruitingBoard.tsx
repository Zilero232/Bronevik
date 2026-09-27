'use client';

import { useTranslations } from 'next-intl';

import { Card, EmptyState, PagedList } from '@/ui-kit';

import type { RecruitingBoardProps } from './RecruitingBoard.types';

import { useRecruitingBoard } from '../../../model/hooks';
import { RecruitingCard } from './components';

export const RecruitingBoard = ({ kind }: RecruitingBoardProps) => {
  const t = useTranslations('recruiting.board');
  const list = useRecruitingBoard(kind);

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
      header={t('count', { total: list.total })}
      list={list}
      renderItem={(post) => <RecruitingCard post={post} />}
      skeletonHeight={160}
    />
  );
};
