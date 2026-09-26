'use client';

import type { TopPlayersMetric } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Card, EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import { TANK_PAGE, TANK_SECTIONS, TOP_METRICS } from '../../../config';
import { useTank } from '../../../model/context';
import { useTankTopPlayers } from '../../../model/hooks';
import { TopPlayerRow, TopPodium } from './components';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('tank.players');
  const { identity } = useTank();
  const { metric, onMetricChange, rows, podium, rest, isPending, isError, isStale, refetch } = useTankTopPlayers();

  return (
    <section aria-labelledby={`${TANK_SECTIONS.players}-title`} className={s.root} data-theme='dark' id={TANK_SECTIONS.players}>
      <div className={s.inner}>
        <header className={s.header}>
          <h2 className={s.title} id={`${TANK_SECTIONS.players}-title`}>
            {t('title')}
          </h2>
          <SegmentedControl<TopPlayersMetric>
            aria-label={t('metricLabel')}
            options={TOP_METRICS.map((value) => ({ value, label: t(`metrics.${value}`) }))}
            size='sm'
            value={metric}
            onChange={onMetricChange}
          />
        </header>
        {match({ isPending, isError, isEmpty: rows.length === 0 })
          .with({ isPending: true }, () => <Skeleton height={TANK_PAGE.skeletonRows * TANK_PAGE.rowHeight} shape='block' width='100%' />)
          .with({ isError: true }, () => <ErrorState onRetry={() => void refetch()} />)
          .with({ isEmpty: true }, () => <EmptyState title={t('emptyTitle')} />)
          .otherwise(() => (
            <div className={s.body} data-stale={isStale}>
              <TopPodium metricLabel={t(`metrics.${metric}`)} rows={podium} />
              {rest.length > 0 && (
                <Card className={s.card} padding='none'>
                  <table aria-busy={isStale} className={s.table}>
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
                      {rest.map((row) => (
                        <TopPlayerRow key={row.key} row={row} />
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};
