'use client';

import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button, Card, DataSourceNote, EmptyState, ErrorState, PageHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import { NEWS } from '../config';
import { useNewsFeed } from '../model/hooks';
import { NewsCard } from './components';

import s from './NewsPage.module.scss';

export const NewsPage = () => {
  const t = useTranslations('news');
  const feed = useNewsFeed();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')} />
      <div className={s.controls}>
        <SegmentedControl
          aria-label={t('filters.label')}
          className={s.filters}
          options={NEWS.filters.map((value) => ({ value, label: t(`filters.${value}`) }))}
          value={feed.kind}
          onChange={feed.setKind}
        />
        <div className={s.tank}>
          <TankPicker className={s.picker} placeholder={t('filters.tank')} value={feed.vehicle} onChange={feed.setVehicle} />
          {feed.isTankFiltered && (
            <Button size='sm' variant='ghost' onClick={feed.clearVehicle}>
              {t('filters.clearTank')}
            </Button>
          )}
        </div>
      </div>
      {feed.isError && <ErrorState description={t('error.description')} isRetrying={feed.isRetrying} title={t('error.title')} onRetry={feed.retry} />}
      {feed.isPending && (
        <div className={s.list}>
          {Array.from({ length: NEWS.skeletons }, (_, index) => (
            <Skeleton key={index} height={96} shape='block' />
          ))}
        </div>
      )}
      {!feed.isPending && !feed.isError && feed.entries.length === 0 && (
        <Card>
          {feed.isTankFiltered ? (
            <EmptyState
              action={
                <Button size='sm' variant='secondary' onClick={feed.clearVehicle}>
                  {t('filters.clearTank')}
                </Button>
              }
              description={t('emptyTank.description')}
              title={t('emptyTank.title')}
            />
          ) : (
            <EmptyState description={t('empty.description')} title={t('empty.title')} />
          )}
        </Card>
      )}
      {feed.entries.length > 0 && (
        <ul className={s.list}>
          {feed.entries.map((entry) => (
            <NewsCard key={entry.item.id} entry={entry} />
          ))}
        </ul>
      )}
      {feed.hasNextPage && (
        <Button className={s.more} disabled={feed.isFetchingNextPage} variant='secondary' onClick={feed.loadMore}>
          {t('more', { shown: feed.entries.length, total: feed.total })}
        </Button>
      )}
      <DataSourceNote />
    </div>
  );
};
