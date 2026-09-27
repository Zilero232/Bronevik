'use client';

import { useTranslations } from 'next-intl';

import { Card, FilteredEmptyState, PagedList } from '@/ui-kit';

import { usePlatoonBoard } from '../../../model/hooks';
import { PlatoonCard } from './components';

export const PlatoonBoard = () => {
  const t = useTranslations('platoons.board');
  const { list, isFiltered, onReset } = usePlatoonBoard();

  return (
    <PagedList
      empty={
        <Card padding='none'>
          <FilteredEmptyState
            description={isFiltered ? t('emptyFilteredDescription') : t('emptyDescription')}
            isFiltered={isFiltered}
            title={t('emptyTitle')}
            onReset={onReset}
          />
        </Card>
      }
      errorDescription={t('errorDescription')}
      errorTitle={t('errorTitle')}
      getKey={(post) => post.id}
      header={t('count', { total: list.total })}
      label={t('title')}
      list={list}
      renderItem={(post) => <PlatoonCard post={post} />}
    />
  );
};
