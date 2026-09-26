'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { toneOfTier } from '@/shared/lib';
import { Card, DataSourceNote, DataTable, EmptyState, ErrorState, Podium, PodiumCard, SectionHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useTopPlayerColumns, useTopPlayers } from '../../../model/hooks';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('home.topPlayers');
  const tc = useTranslations('home.columns');
  const format = useFormatter();
  const { metric, setMetric, podium, rest, isPending, isError, retry } = useTopPlayers();
  const columns = useTopPlayerColumns(metric);

  return (
    <section aria-labelledby='home-top-players' className={s.root}>
      <SectionHeader
        action={
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
        variant='display'
      />
      {isError && <ErrorState isCompact onRetry={retry} />}
      {!isError && (
        <>
          <Podium aria-label={t('title')}>
            {isPending &&
              Array.from({ length: HOME.topPlayers.podium }, (_, index) => (
                <li key={index}>
                  <Skeleton className={s.skeleton} height={120} shape='block' />
                </li>
              ))}
            {!isPending &&
              podium.map((entry) => (
                <PodiumCard
                  key={`${entry.rank}-${entry.name}`}
                  href={ROUTES.players.profile(entry.name)}
                  meta={t('battles', { count: entry.battles })}
                  metricLabel={tc(metric)}
                  name={entry.clanTag ? `${entry.name} [${entry.clanTag}]` : entry.name}
                  rank={entry.rank}
                  rankLabel={`${t('rank')} ${entry.rank}`}
                  tone={entry.tier ? toneOfTier(entry.tier) : null}
                  value={format.number(entry.value, { maximumFractionDigits: 0 })}
                />
              ))}
          </Podium>
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
