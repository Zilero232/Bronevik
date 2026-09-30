'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { ROUTES } from '@/shared/constants';
import { Button, Card, CardHeader, DataTable, FilteredEmptyState, QueryState, Tabs } from '@/ui-kit';

import type { ReplayTab } from './ReplayBrowser.types';

import { REPLAY_TABS } from '../../../config';
import { useReplayBrowser } from '../../../model/hooks/use-replay-browser';
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
    query,
    total,
    pager,
    isFiltered,
    isPaging,
    empty,
    columns,
    vehicleOf,
    mapNameOf,
    setTab,
    resetFilters,
    goPrev,
    goNext
  } = useReplayBrowser();

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
      <QueryState
        isCompact
        skeleton={
          <DataTable
            isLoading
            columns={columns}
            data={[]}
            density='media'
            renderCard={(row) => <ReplayCard replay={row} vehicle={vehicleOf(row)} />}
          />
        }
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        query={query}
      >
        {({ items }) => (
          <DataTable
            emptyState={
              <FilteredEmptyState description={t(empty.description)} isFiltered={isFiltered} title={t(empty.title)} onReset={resetFilters} />
            }
            footer={
              pager.pages > 1 && (
                <div className={s.pager}>
                  <Button disabled={pager.prevOffset === null || isPaging} size='sm' variant='secondary' onClick={goPrev}>
                    {t('prev')}
                  </Button>
                  <span className={s.page}>{t('page', { page: pager.page, pages: pager.pages })}</span>
                  <Button disabled={pager.nextOffset === null || isPaging} size='sm' variant='secondary' onClick={goNext}>
                    {t('next')}
                  </Button>
                </div>
              )
            }
            caption={t('title')}
            columns={columns}
            data={items}
            density='media'
            getRowId={(row) => row.id}
            getRowLink={(row) => ({ href: ROUTES.replays.detail(row.id), label: mapNameOf(row) ?? t('unknownMap') })}
            renderCard={(row) => <ReplayCard replay={row} vehicle={vehicleOf(row)} />}
          />
        )}
      </QueryState>
    </Card>
  );
};
