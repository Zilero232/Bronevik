'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { toneOfTier } from '@/shared/lib';
import { Card, DataSourceNote, DataTable, EmptyState, Podium, PodiumCard, QueryState, SectionHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import { HOME } from '../../../config';
import { useTopPlayerColumns, useTopPlayers } from '../../../model/hooks';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('home.topPlayers');
  const tc = useTranslations('home.columns');
  const format = useFormatter();
  const { metric, setMetric, query } = useTopPlayers();
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
      <QueryState
        isCompact
        skeleton={
          <>
            <Podium aria-label={t('title')}>
              {Array.from({ length: HOME.topPlayers.podium }, (_, index) => (
                <li key={index}>
                  <Skeleton className={s.skeleton} height={120} shape='block' />
                </li>
              ))}
            </Podium>
            <Card padding='none'>
              <DataTable isLoading columns={columns} data={[]} />
            </Card>
          </>
        }
        empty={<EmptyState isCompact title={t('empty')} />}
        isEmpty={({ podium }) => podium.length === 0}
        query={query}
      >
        {({ podium, rest }) => (
          <>
            <Podium aria-label={t('title')}>
              {podium.map((entry) => (
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
            {rest.length > 0 && (
              <Card padding='none'>
                <DataTable
                  caption={t('title')}
                  columns={columns}
                  data={rest}
                  getRowId={(entry) => `${entry.rank}-${entry.name}`}
                  getRowLink={(entry) => ({ href: ROUTES.players.profile(entry.name), label: entry.name, hasCellLink: true })}
                />
              </Card>
            )}
          </>
        )}
      </QueryState>
      <DataSourceNote />
    </section>
  );
};
