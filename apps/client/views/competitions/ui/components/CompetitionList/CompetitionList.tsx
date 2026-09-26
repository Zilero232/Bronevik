'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, PagedList, SegmentedControl, Switch } from '@/ui-kit';

import { COMPETITION_FILTERS, COMPETITION_LIST } from '../../../config';
import { useCompetitionList } from '../../../model/hooks';
import { CompetitionRow } from './components';

import s from './CompetitionList.module.scss';

export const CompetitionList = () => {
  const t = useTranslations('competitions');
  const {
    filter,
    isMine,
    isSignedIn,
    items,
    isPending,
    isError,
    isRetrying,
    hasNextPage,
    isFetchingNextPage,
    onFilterChange,
    onMineChange,
    loadMore,
    retry
  } = useCompetitionList();

  return (
    <Card padding='none'>
      <CardHeader
        action={
          <div className={s.controls}>
            {isSignedIn && <Switch checked={isMine} label={t('list.mine')} onCheckedChange={onMineChange} />}
            <SegmentedControl
              aria-label={t('list.filter')}
              options={COMPETITION_FILTERS.map((value) => ({ value, label: value === 'all' ? t('list.all') : t(`status.${value}`) }))}
              size='sm'
              value={filter}
              onChange={onFilterChange}
            />
          </div>
        }
        title={t('list.title')}
      />
      <PagedList
        empty={
          <EmptyState isCompact description={isMine ? t('list.emptyMineDescription') : t('list.emptyDescription')} title={t('list.emptyTitle')} />
        }
        errorDescription={t('list.errorDescription')}
        errorTitle={t('list.errorTitle')}
        getKey={(competition) => competition.id}
        hasNextPage={hasNextPage}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        isRetrying={isRetrying}
        items={items}
        layout='rows'
        renderItem={(competition) => <CompetitionRow competition={competition} />}
        skeletonHeight={COMPETITION_LIST.skeletonHeight}
        onLoadMore={loadMore}
        onRetry={retry}
      />
    </Card>
  );
};
