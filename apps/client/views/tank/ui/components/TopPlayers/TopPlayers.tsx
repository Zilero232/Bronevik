'use client';

import type { TopPlayersMetric } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Card, CardHeader, EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS, TOP_METRICS } from '../../../config';
import { useTank } from '../../../model/context';
import { useTankTopPlayers } from '../../../model/hooks';
import { TopPlayerRow } from './components';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('tank.players');
  const { identity } = useTank();
  const { metric, onMetricChange, rows, isPending, isError, isStale, refetch } = useTankTopPlayers();

  return (
    <Card className={s.root} id={TANK_SECTIONS.players} padding='none'>
      <CardHeader
        action={
          <SegmentedControl<TopPlayersMetric>
            aria-label={t('metricLabel')}
            options={TOP_METRICS.map((value) => ({ value, label: t(`metrics.${value}`) }))}
            size='sm'
            value={metric}
            onChange={onMetricChange}
          />
        }
        className={s.header}
        title={t('title')}
      />
      {match({ isPending, isError, isEmpty: rows.length === 0 })
        .with({ isPending: true }, () => <Skeleton height={TANK_PAGE.skeletonRows * TANK_PAGE.rowHeight} shape='block' width='100%' />)
        .with({ isError: true }, () => <ErrorState onRetry={() => void refetch()} />)
        .with({ isEmpty: true }, () => <EmptyState title={t('emptyTitle')} />)
        .otherwise(() => (
          <table aria-busy={isStale} className={s.table} data-stale={isStale}>
            <caption className={s.caption}>{t('caption', { name: identity.name })}</caption>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>{t('player')}</th>
                <th scope='col'>{t('battlesColumn')}</th>
                <th scope='col'>{t(`metrics.${metric}`)}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <TopPlayerRow key={row.key} row={row} />
              ))}
            </tbody>
          </table>
        ))}
    </Card>
  );
};
