'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Card, DataSourceNote, DataTable, EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useTopPlayerColumns, useTopPlayers } from '../../../model/hooks';
import { SectionTitle } from '../SectionTitle';
import { PodiumCard } from './components';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('home.topPlayers');
  const tc = useTranslations('home.columns');
  const { metric, setMetric, podium, rest, isPending, isError, retry } = useTopPlayers();
  const columns = useTopPlayerColumns(metric);

  return (
    <section aria-labelledby='home-top-players' className={s.root}>
      <SectionTitle
        aside={
          <SegmentedControl
            aria-label={t('metric')}
            options={HOME.topPlayers.metrics.map((value) => ({ value, label: tc(value) }))}
            size='sm'
            value={metric}
            onChange={setMetric}
          />
        }
        id='home-top-players'
        meta={t('period')}
        more={{ href: ROUTES.top, label: t('all') }}
        title={t('title')}
      />
      {isError && <ErrorState isCompact onRetry={retry} />}
      {!isError && (
        <>
          <ol className={s.podium}>
            {isPending &&
              Array.from({ length: HOME.topPlayers.podium }, (_, index) => (
                <li key={index}>
                  <Skeleton className={s.skeleton} height={120} shape='block' />
                </li>
              ))}
            {!isPending &&
              podium.map((entry) => (
                <li key={`${entry.rank}-${entry.name}`} className={s.place}>
                  <PodiumCard entry={entry} metricLabel={tc(metric)} />
                </li>
              ))}
          </ol>
          {!isPending && podium.length === 0 && <EmptyState isCompact title={t('empty')} />}
          {(isPending || rest.length > 0) && (
            <Card padding='none'>
              <DataTable columns={columns} data={rest} getRowId={(entry) => `${entry.rank}-${entry.name}`} isLoading={isPending} />
            </Card>
          )}
        </>
      )}
      <DataSourceNote />
    </section>
  );
};
