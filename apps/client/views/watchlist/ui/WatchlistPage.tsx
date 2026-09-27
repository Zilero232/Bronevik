'use client';

import { WATCHLIST_PERIODS } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { LimitNotice } from '@/features/plus/plus-gate';
import { Card, CardHeader, EmptyState, KeyFigure, KeyFigures, QueryState, SectionHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import { WATCHLIST_PAGE } from '../config';
import { useWatchlistPage } from '../model/hooks';
import { AddWatchPlayer, DigestSettings, WatchlistTable } from './components';

import s from './WatchlistPage.module.scss';

export const WatchlistPage = () => {
  const t = useTranslations('watchlist');
  const { period, query, players, summary, watchedIds, isFull, onPeriodChange } = useWatchlistPage();

  return (
    <div className={s.root}>
      <SectionHeader
        action={
          <SegmentedControl
            aria-label={t('period.label')}
            options={WATCHLIST_PERIODS.map((value) => ({ value, label: t(`period.${value}`) }))}
            size='sm'
            value={period}
            onChange={onPeriodChange}
          />
        }
        as='h2'
        description={t('description')}
        title={t('title')}
      />
      <QueryState
        skeleton={WATCHLIST_PAGE.skeletonHeights.map((height) => (
          <Skeleton key={height} height={height} shape='block' />
        ))}
        errorDescription={t('error')}
        query={query}
      >
        {(watchlist) => (
          <>
            <KeyFigures>
              <KeyFigure label={t('summary.watched')} tone='steel' value={summary.watched} />
              <KeyFigure label={t(`summary.active.${period}`)} tone='good' value={summary.active} />
              <KeyFigure label={t('summary.battles')} tone='steel' value={summary.battles} />
              <KeyFigure label={t('summary.marks')} tone='good' value={summary.marks} />
            </KeyFigures>
            <Card padding='none'>
              <CardHeader
                action={<AddWatchPlayer excludeIds={watchedIds} isFull={isFull} />}
                meta={t('table.limit', { used: players.length, limit: watchlist.limit })}
                title={t('table.title')}
              />
              <LimitNotice className={s.notice} limitKey='watchedPlayers' used={players.length} />
              {players.length === 0 ? (
                <EmptyState isCompact description={t('empty.description')} title={t('empty.title')} />
              ) : (
                <WatchlistTable players={players} />
              )}
            </Card>
            <DigestSettings digest={watchlist.digest} lastDigestAt={watchlist.lastDigestAt} />
          </>
        )}
      </QueryState>
    </div>
  );
};
