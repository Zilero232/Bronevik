'use client';

import type { RatingPeriod } from '@otmetki/schemas';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { Card, CardHeader, DataSourceNote, EmptyState, PageHeader, QueryState, SegmentedControl } from '@/ui-kit';

import { useComparePage } from '../model/hooks';
import { AddSlot, CompareTable, PlayerSlot } from './components';

import s from './ComparePlayersPage.module.scss';

export const ComparePlayersPage = () => {
  const t = useTranslations('compare');
  const titleId = useId();
  const tPeriods = useTranslations('periods');
  const { ids, period, setPeriod, periodOptions, canAdd, add, remove, query, isIdle, isMissing } = useComparePage();

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
      <Card aria-labelledby={titleId} padding='none'>
        <CardHeader
          action={
            <SegmentedControl<RatingPeriod> aria-label={tPeriods('label')} options={periodOptions} size='sm' value={period} onChange={setPeriod} />
          }
          title={<span id={titleId}>{t('caption')}</span>}
        />
        {isIdle || isMissing ? (
          <EmptyState isCompact title={isIdle ? t('emptyTitle') : t('missingTitle')} />
        ) : (
          <QueryState
            isCompact
            errorTitle={t('errorTitle')}
            query={query}
            skeleton={<CompareTable isLoading comparison={undefined} period={period} />}
          >
            {(comparison) => <CompareTable comparison={comparison} period={period} />}
          </QueryState>
        )}
      </Card>
      <DataSourceNote />
    </div>
  );
};
