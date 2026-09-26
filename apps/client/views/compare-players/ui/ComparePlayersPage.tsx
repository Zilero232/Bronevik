'use client';

import type { RatingPeriod } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Card, CardHeader, DataSourceNote, EmptyState, ErrorState, PageHeader, SegmentedControl } from '@/ui-kit';

import { useComparePage } from '../model/hooks';
import { AddSlot, CompareTable, PlayerSlot } from './components';

import s from './ComparePlayersPage.module.scss';

export const ComparePlayersPage = () => {
  const t = useTranslations('compare');
  const tPeriods = useTranslations('periods');
  const { ids, period, setPeriod, periodOptions, canAdd, add, remove, comparison, status, isRetrying, retry } = useComparePage();

  return (
    <div className={s.root}>
      <PageHeader description={t('description')} title={t('title')}>
        <div className={s.slots}>
          {ids.map((id, index) => (
            <PlayerSlot key={id} accountId={id} index={index} onRemove={() => remove(id)} />
          ))}
          {canAdd && <AddSlot excludeIds={ids} index={ids.length} onAdd={add} />}
        </div>
      </PageHeader>
      <Card aria-labelledby='compare-table-title' padding='none'>
        <CardHeader
          action={
            <SegmentedControl<RatingPeriod> aria-label={tPeriods('label')} options={periodOptions} size='sm' value={period} onChange={setPeriod} />
          }
          title={<span id='compare-table-title'>{t('caption')}</span>}
        />
        {match(status)
          .with('idle', () => <EmptyState isCompact title={t('emptyTitle')} />)
          .with('missing', () => <EmptyState isCompact title={t('missingTitle')} />)
          .with('error', () => <ErrorState isCompact isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />)
          .otherwise(() => (
            <CompareTable comparison={comparison} isLoading={status === 'loading'} period={period} />
          ))}
      </Card>
      <DataSourceNote />
    </div>
  );
};
