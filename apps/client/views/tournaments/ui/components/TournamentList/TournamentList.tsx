'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, PagedList, SegmentedControl } from '@/ui-kit';

import { TOURNAMENT_FILTERS } from '../../../config';
import { useTournamentList } from '../../../model/hooks';
import { TournamentRow } from './components';

export const TournamentList = () => {
  const t = useTranslations('tournaments');
  const { filter, items, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, onFilterChange, loadMore, retry } = useTournamentList();

  return (
    <Card padding='none'>
      <CardHeader
        action={
          <SegmentedControl
            aria-label={t('list.filter')}
            options={TOURNAMENT_FILTERS.map((value) => ({ value, label: value === 'all' ? t('list.all') : t(`status.${value}`) }))}
            size='sm'
            value={filter}
            onChange={onFilterChange}
          />
        }
        title={t('list.title')}
      />
      <PagedList
        empty={<EmptyState isCompact description={t('list.emptyDescription')} title={t('list.emptyTitle')} />}
        errorDescription={t('list.errorDescription')}
        errorTitle={t('list.errorTitle')}
        getKey={(tournament) => tournament.id}
        hasNextPage={hasNextPage}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        isRetrying={isRetrying}
        items={items}
        layout='rows'
        renderItem={(tournament) => <TournamentRow tournament={tournament} />}
        skeletonHeight={56}
        onLoadMore={loadMore}
        onRetry={retry}
      />
    </Card>
  );
};
