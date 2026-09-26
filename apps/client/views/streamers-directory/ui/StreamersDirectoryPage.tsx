'use client';

import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { MyFollowsStrip } from '@/features/streamer/follow-streamer';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, Card, DataSourceNote, EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import { DIRECTORY } from '../config';
import { useStreamersDirectory } from '../model/hooks';
import { DirectoryFilters, StreamerCard } from './components';

import s from './StreamersDirectoryPage.module.scss';

export const StreamersDirectoryPage = () => {
  const t = useTranslations('streamersDirectory');
  const directory = useStreamersDirectory();

  return (
    <div className={s.root}>
      <PageHeader
        actions={
          <>
            <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.streamers.settings.table}>
              <SlidersHorizontal size={DIRECTORY.iconSize} />
              {t('head.settings')}
            </Link>
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.streamers.forStreamers}>
              {t('head.forStreamers')}
              <ArrowRight size={DIRECTORY.iconSize} />
            </Link>
          </>
        }
        description={t('head.description')}
        title={t('head.title')}
      />
      <MyFollowsStrip />
      <DirectoryFilters />
      {directory.isError && (
        <ErrorState description={t('error.description')} isRetrying={directory.isRetrying} title={t('error.title')} onRetry={directory.retry} />
      )}
      {directory.isPending && (
        <div aria-busy className={s.grid}>
          {DIRECTORY.skeletons.map((index) => (
            <Skeleton key={index} height={DIRECTORY.skeletonHeight} shape='block' />
          ))}
        </div>
      )}
      {directory.isEmpty && (
        <Card>
          {directory.hasFilters ? (
            <EmptyState
              action={
                <Button size='sm' variant='secondary' onClick={directory.reset}>
                  {t('empty.reset')}
                </Button>
              }
              description={t('empty.filteredDescription')}
              title={t('empty.filteredTitle')}
            />
          ) : (
            <EmptyState
              action={
                <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.streamer}>
                  {t('empty.action')}
                </Link>
              }
              description={t('empty.description')}
              title={t('empty.title')}
            />
          )}
        </Card>
      )}
      {directory.entries.length > 0 && (
        <ul className={s.grid}>
          {directory.entries.map((entry) => (
            <StreamerCard key={entry.card.slug} entry={entry} />
          ))}
        </ul>
      )}
      {directory.hasNextPage && (
        <Button className={s.more} disabled={directory.isFetchingNextPage} variant='secondary' onClick={directory.loadMore}>
          {t('more')}
        </Button>
      )}
      <DataSourceNote />
    </div>
  );
};
