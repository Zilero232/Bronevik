'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/navigation';
import { Button, Card, CardHeader, DataTable, EmptyState, ErrorState, Tabs } from '@/ui-kit';

import type { ReplayTab } from './ReplayBrowser.types';

import { REPLAY_TABS } from '../../../config';
import { useReplayColumns, useReplaysFeed } from '../../../model/hooks';
import { ReplayFilters } from '../ReplayFilters';

import s from './ReplayBrowser.module.scss';

export const ReplayBrowser = () => {
  const t = useTranslations('replays.list');
  const titleId = useId();
  const router = useRouter();
  const {
    tab,
    isSignedIn,
    isMine,
    items,
    total,
    pager,
    isFiltered,
    empty,
    isPending,
    isError,
    isFetching,
    setTab,
    resetFilters,
    goPrev,
    goNext,
    retry
  } = useReplaysFeed();

  const columns = useReplayColumns();

  return (
    <Card aria-labelledby={titleId} className={s.root} padding='none'>
      <CardHeader
        tabs={
          isSignedIn && (
            <Tabs<ReplayTab> items={REPLAY_TABS.map((value) => ({ value, label: t(`tabs.${value}`) }))} value={tab} onValueChange={setTab} />
          )
        }
        meta={t('total', { total })}
        title={<span id={titleId}>{t('title')}</span>}
      />
      {!isMine && <ReplayFilters />}
      {isError && items.length === 0 ? (
        <ErrorState isCompact description={t('errorDescription')} isRetrying={isFetching} title={t('errorTitle')} onRetry={retry} />
      ) : (
        <DataTable
          emptyState={
            <EmptyState
              isCompact
              action={
                isFiltered && (
                  <Button size='sm' variant='secondary' onClick={resetFilters}>
                    {t('resetFilters')}
                  </Button>
                )
              }
              description={t(empty.description)}
              title={t(empty.title)}
            />
          }
          footer={
            pager.pages > 1 && (
              <div className={s.pager}>
                <Button disabled={pager.prevOffset === null || isFetching} size='sm' variant='secondary' onClick={goPrev}>
                  {t('prev')}
                </Button>
                <span className={s.page}>{t('page', { page: pager.page, pages: pager.pages })}</span>
                <Button disabled={pager.nextOffset === null || isFetching} size='sm' variant='secondary' onClick={goNext}>
                  {t('next')}
                </Button>
              </div>
            )
          }
          columns={columns}
          data={items}
          density='media'
          getRowId={(row) => row.id}
          isLoading={isPending}
          onRowClick={(row) => router.push(ROUTES.replays.detail(row.id))}
        />
      )}
    </Card>
  );
};
