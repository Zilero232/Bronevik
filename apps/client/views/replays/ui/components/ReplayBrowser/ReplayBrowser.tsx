'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { Button, Card, CardHeader, DataTable, ErrorState, FilteredEmptyState, Tabs } from '@/ui-kit';

import type { ReplayTab } from './ReplayBrowser.types';

import { REPLAY_TABS } from '../../../config';
import { useReplayColumns, useReplaysFeed, useReplayVehicle } from '../../../model/hooks';
import { ReplayFilters } from '../ReplayFilters';
import { ReplayCard } from './components';

import s from './ReplayBrowser.module.scss';

export const ReplayBrowser = () => {
  const t = useTranslations('replays.list');
  const titleId = useId();
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
  const vehicleOf = useReplayVehicle();

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
            <FilteredEmptyState isCompact description={t(empty.description)} isFiltered={isFiltered} title={t(empty.title)} onReset={resetFilters} />
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
          getRowLink={(row) => ({ href: ROUTES.replays.detail(row.id), label: row.mapName ?? row.arenaId ?? t('unknownMap') })}
          isLoading={isPending}
          renderCard={(row) => <ReplayCard replay={row} vehicle={vehicleOf(row)} />}
        />
      )}
    </Card>
  );
};
